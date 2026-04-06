import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteData } from '../types';
import { INITIAL_SITE_DATA } from '../constants';
import imageCompression from 'browser-image-compression';
import { db, auth, storage } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDocFromServer,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't necessarily want to crash the whole app for the user, 
  // but we should log it for debugging.
}

interface SiteContextType {
  data: SiteData;
  user: User | null;
  isAuthReady: boolean;
  updateData: (newData: Partial<SiteData>) => void;
  saveToFirestore: () => Promise<void>;
  addNotice: (notice: { title: string; content: string }) => void;
  deleteNotice: (id: string) => void;
  updateNotice: (id: string, notice: { title: string; content: string }) => void;
  compressAndSetImage: (file: File, callback: (base64: string) => void) => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Enable offline persistence if possible
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence');
    }
  });
} catch (e) {
  // Ignore
}

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(INITIAL_SITE_DATA);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Firestore Connection Test & Initial Load
  useEffect(() => {
    async function testConnection() {
      try {
        const docRef = doc(db, 'site', 'data');
        await getDocFromServer(docRef);
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    }
    testConnection();
  }, []);

  // 3. Real-time Firestore Listener
  useEffect(() => {
    const docRef = doc(db, 'site', 'data');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data() as SiteData;
        
        // Data Migration / Merging
        const mergedData = {
          ...INITIAL_SITE_DATA,
          ...remoteData,
          quickMenu: { ...INITIAL_SITE_DATA.quickMenu, ...(remoteData.quickMenu || {}) },
          floorPlans: (remoteData.floorPlans || []).map((plan: any) => {
            if (!plan.images && plan.image) {
              return { ...plan, images: [plan.image] };
            }
            if (!plan.images) {
              return { ...plan, images: [] };
            }
            return plan;
          })
        };
        
        setData(mergedData);
        setIsDataLoaded(true);
      } else {
        // If no data in Firestore, use INITIAL_SITE_DATA
        // We don't automatically save it yet to avoid accidental overwrites
        setIsDataLoaded(true);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'site/data');
    });

    return () => unsubscribe();
  }, []);

  // 4. SEO Updates
  useEffect(() => {
    document.title = data.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', data.seoDescription);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = data.seoDescription;
      document.head.appendChild(newMeta);
    }
  }, [data.seoTitle, data.seoDescription]);

  const updateData = (newData: Partial<SiteData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const saveToFirestore = async () => {
    if (!user) {
      console.warn('User not authenticated. Cannot save to Firestore.');
      return;
    }
    
    // 데이터 크기 대략적 계산 (1MB 제한 체크)
    const dataString = JSON.stringify(data);
    const dataSizeInBytes = new Blob([dataString]).size;
    const MAX_SIZE = 1000000; // 약 1MB
    
    if (dataSizeInBytes > MAX_SIZE) {
      const errorMsg = `저장 용량 초과: 현재 약 ${(dataSizeInBytes / 1024 / 1024).toFixed(2)}MB입니다. 이미지가 너무 많거나 큽니다. 이미지를 다시 업로드하여 서버에 저장해 주세요. (새로 업로드한 이미지는 용량을 거의 차지하지 않습니다.)`;
      throw new Error(errorMsg);
    }

    try {
      const docRef = doc(db, 'site', 'data');
      await setDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site/data');
      throw error;
    }
  };

  const addNotice = (notice: { title: string; content: string }) => {
    const newNotice = {
      id: Date.now().toString(),
      title: notice.title,
      content: notice.content,
      date: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      notices: [newNotice, ...prev.notices]
    }));
  };

  const deleteNotice = (id: string) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.filter(n => n.id !== id)
    }));
  };

  const updateNotice = (id: string, notice: { title: string; content: string }) => {
    setData(prev => ({
      ...prev,
      notices: prev.notices.map(n => n.id === id ? { ...n, ...notice } : n)
    }));
  };

  const compressAndSetImage = async (file: File, callback: (url: string) => void) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const options = {
      maxSizeMB: 0.8, // Storage를 사용하므로 압축을 덜 해도 됩니다 (고화질 유지)
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      // 1. 이미지 압축
      const compressedFile = await imageCompression(file, options);
      
      // 2. Firebase Storage에 업로드
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `images/${user.uid}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, compressedFile);
      
      // 3. 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // 4. 콜백으로 URL 전달
      callback(downloadURL);
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <SiteContext.Provider value={{ 
      data, 
      user, 
      isAuthReady, 
      updateData, 
      saveToFirestore, 
      addNotice, 
      deleteNotice, 
      updateNotice, 
      compressAndSetImage 
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};
