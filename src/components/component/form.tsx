"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Noto_Kufi_Arabic } from "@next/font/google";
import { sendToTelegram } from "@/lib/sendToTelegram";
import { pageview } from "@/lib/pageview";
import React, { useState, useEffect } from "react";
import getUserIP from "../../lib/getUserIP";
import { sha256 } from "js-sha256";
import * as fbq from "../../lib/fpixel";

const additionalData = {};
const eventID: string = crypto.randomUUID();
const eventID2: string = crypto.randomUUID();
const rubik = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
});

export function Form() {
  useEffect(() => {
    pageview(eventID2);
  }, []);

  const [formData, setFormData] = useState({
    facebook: "",
    chessUsername: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

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
        setAvatarUrl("/placeholder-avatar.png"); // Default placeholder if error
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
      setAvatarUrl("/placeholder-avatar.png"); // Default placeholder if error
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const eventTime = Math.floor(Date.now() / 1000);
    const Time = new Date().toLocaleString('en-US', { timeZone: 'Africa/Algiers' });
    const userIp: string = (await getUserIP()).toString();

    // Create message object (you can add more fields as needed)
    const messageData = {
      profile: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
      IP: userIp,
      eventTime: Time,
      eventID: eventID,
      facebookName: formData.facebook,
      chessUsername: formData.chessUsername, 
    };

    // Convert message object to JSON string
    const message = JSON.stringify(messageData, null, 2); // 2 spaces for indentation

    //const email: string = formData.email || ''; // Assuming you're not using email anymore
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
      "test_event_code": "TEST85494"
    };


    console.log("Sending this message to Telegram:", message); // Log the JSON message
    await sendToTelegram(message, messageCompleteRegistration, eventID);
    alert('تم إرسال البيانات بنجاح!');
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
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg px-8 py-6 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        dir="rtl"
      >
        {/* Logo - Add this section */}
        <div className="flex justify-center mb-6"> {/* Adjust margin as needed */}
          <img 
            src="/logo.png"  // Replace with your logo path
            alt="Your Logo" 
            className="w-48 h-auto" // Adjust size as needed 
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
            placeholder="أدخل اسم اسم المستخدم الخاص بك في chess.com"
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

        {/* Avatar Display */}
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

        <Button className="w-full" type="submit">
          أدخل للفوز والترقية!
        </Button>
      </form>
    </div>
  );
}