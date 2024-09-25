"use client"
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Noto_Kufi_Arabic } from "next/font/google";
import { sendToTelegram } from "@/lib/sendToTelegram";
import { pageview } from "@/lib/pageview";
import getUserIP from "@/lib/getUserIP";
import ReactConfetti from 'react-confetti';
import { useRouter } from 'next/navigation';

const eventID: string = crypto.randomUUID();
const eventID2: string = crypto.randomUUID();
const rubik = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">تم إرسال البيانات بنجاح!</h2>
        <p className="mb-6">اختر منصة للمتابعة</p>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push('https://www.instagram.com/eliteofferz/')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Instagram
          </Button>
          <Button
            onClick={() => router.push('https://www.facebook.com/EliteOfferz')}
            className="bg-blue-600 text-white"
          >
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export function Form() {
  const [formData, setFormData] = useState({
    facebook: "",
    chessUsername: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    pageview(eventID2);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchChessAvatar = async (username: string) => {
    setIsLoadingAvatar(true);
    try {
      const response = await fetch(
        `https://api.chess.com/pub/player/${username}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvatarUrl(data.avatar);
      } else {
        console.error("Error fetching avatar:", response.status);
        setAvatarUrl("/placeholder-avatar.png");
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
      setAvatarUrl("/placeholder-avatar.png");
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventTime = Math.floor(Date.now() / 1000);
    const Time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' });
    const userIp: string = (await getUserIP()).toString();

    const messageData = {
      profile: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      IP: userIp,
      eventTime: Time,
      eventID: eventID,
      facebookName: formData.facebook,
      chessUsername: formData.chessUsername, 
    };

    const message = JSON.stringify(messageData, null, 2);

    const messageCompleteRegistration = {
      "data": [
        {
          "event_name": "CompleteRegistration",
          "event_time": eventTime,
          "action_source": "website",
          "event_source_url": window.location.href,
          "event_id": eventID,
          "user_data": {
            "client_ip_address": userIp,
            "client_user_agent": navigator.userAgent
          }
        }
      ],
      "test_event_code": "TEST81446" 
    };

    console.log("Sending this message to Telegram:", message);
    await sendToTelegram(message, messageCompleteRegistration, eventID);
    
    setShowConfetti(true);
    setShowPopup(true);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 7000);

    setFormData({ facebook: '', chessUsername: '' });
    setAvatarUrl('');
  };

  return (
    <div
      key="1"
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 bg-cover bg-center ${rubik.className}`}
      style={{
        backgroundImage: "url('/bg.svg')",
      }}
    >
      {showConfetti && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 9999,
          pointerEvents: 'none' // This allows clicks to pass through
        }}>
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={400}
            gravity={0.25}
            wind={0.01}
            colors={[
              '#ddc203', '#305cd8', '#ff6b6b', '#4ecdc4', '#45b7d1',
              '#ff9ff3', '#feca57', '#54a0ff', '#5f27cd', '#ff6b6b',
              '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'
            ]}
            confettiSource={{x: 0, y: 0, w: window.innerWidth, h: 0}}
          />
        </div>
      )}
      {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg px-8 py-6 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        dir="rtl"
      >
        <div className="flex justify-center mb-6">
          <img 
            src="/logo.png"
            alt="Your Logo" 
            className="w-48 h-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100"></h2>

        <div className="space-y-2">
          <Label htmlFor="facebook" className="text-lg">
            اسمك على الفايسبوك<span className="text-red-500">*</span>
          </Label>
          <Input
            id="facebook"
            name="facebook"
            placeholder="أدخل رابط حسابك على الفيسبوك"
            required
            type="text"
            value={formData.facebook}
            onChange={handleInputChange}
          />
          <p className="text-base text-gray-500 dark:text-gray-400">
            ( نحن بحاجة إلى هذا حتى نتمكن من الاتصال بك عندما تفوز.)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chessUsername" className="text-lg">
            اسمك حسابك على chess.com
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="chessUsername"
            name="chessUsername"
            placeholder="أدخل إسم المستخدم الخاص بك في chess.com"
            required
            type="text"
            value={formData.chessUsername}
            onChange={(e) => {
              handleInputChange(e);
              fetchChessAvatar(e.target.value);
            }}
          />
          <p className="text-base text-gray-500 dark:text-gray-400">
            ( نحن بحاجة إلى هذا لتفعيل اشتراكك مباشرة بعد فوزك.)
          </p>
        </div>

        <div className="flex justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Chess.com Avatar"
              className="rounded-full w-24 h-24 shadow-md"
            />
          ) : (
            <img
              src="/placeholder-avatar.png"
              alt="Placeholder Avatar"
              className="rounded-full w-24 h-24 shadow-md"
            />
          )}
        </div>
        <p className="text-base text-red-500 dark:text-gray-400">
          ( لا تنسى ترك تعليق على المنشور.)
        </p>
        <Button className="w-full" type="submit">
          أدخل للمشاركة للفوز
        </Button>
      </form>
    </div>
  );
}