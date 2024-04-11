"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Noto_Kufi_Arabic} from '@next/font/google'
import { sendToTelegram } from '@/lib/sendToTelegram';
import { sendToFb } from '@/lib/sendToFb';
import React, { useState } from 'react';
import getUserIP from '../../lib/getUserIP';
import { sha256 } from "js-sha256";
import * as fbq from "../../lib/fpixel";


const rubik = Noto_Kufi_Arabic({ subsets: ['arabic'],
 weight:['500','600','700'],
 })
export function Form() {
  const [formData, setFormData] = useState<{ [key: string]: string | string[] }>({
    facebook: '',
    group: '',
    email: '',
    website: '',
    specialty: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
          ? [...(prevData[name] as string[]), value]
          : (prevData[name] as string[]).filter(item => item !== value),
      }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eventID = fbq.event; 
    const eventTime = Math.floor(Date.now() / 1000); // new Date();: 
    const userIp = await getUserIP();
    const message = `
    profile: ${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
    IP: ${userIp}
    eventTime: ${eventTime}
    eventID: ${eventID}
اسمك على الفايسبوك: "${formData.facebook}" \n
اسم المجموعة: "${formData.group}" \n
البريد الإلكتروني: "${formData.email}" \n
portfolio / تصاميمك: "${formData.website}"\n
تخصص التصميم: ${(formData.specialty as string[]).join(', ')}
  `;
  const email:  string = formData.email;
  const messageCompleteRegistration = `{
    "data": [
        {
            "event_name": "CompleteRegistration",
            "event_time": ${eventTime},
            "action_source": "website",
            "event_source_url": "${window.location.href}",
            "user_data": {
                "em": [
                    "${sha256(email)}"
                ],
                "client_ip_address": ${getUserIP()},
                "client_user_agent": "${navigator.userAgent}"
            }
        }
    ], 
}`;
    console.log(formData)
    const additionalData = {};
    await sendToTelegram(message);
    fbq.event("CompleteRegistration", additionalData, {eventID: eventID} )
    await sendToFb(message);
    alert('تم إرسال البيانات بنجاح!');
    setFormData({
      facebook: '',
      group: '',
      email: '',
      website: '',
      specialty: [],
    });
  };
  return (
    <div
      key="1"
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 bg-cover bg-center ${rubik.className}`} 
      style={{
        backgroundImage: "url('/bg.svg')",
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-lg px-8 py-6 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800" dir="rtl">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
        </h2>
        <div className="space-y-2">
          <Label htmlFor="facebook" className="text-lg">اسمك على الفايسبوك</Label>
          <span className="text-red-500">*</span>
          <Input id="facebook" name="facebook" placeholder="أدخل رابط حسابك على الفيسبوك" required type="text" value={formData.facebook} onChange={handleChange} />
          <p className="text-base text-gray-500 dark:text-gray-400">
            ( نحن بحاجة إلى هذا حتى نتمكن من الاتصال بك عندما تفوز.)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="group" className="text-lg">
            اسم المجموعة
            <span className="text-red-500">*</span>
          </Label>
          <Input id="group" name="group" placeholder="أدخل اسم مجموعتك" required type="text" value={formData.group} onChange={handleChange} />
          <p className="text-base text-gray-500 dark:text-gray-400">اسم المجموعة التي تشارك منها!.</p>
        </div>
        <div className="space-y-4">
          <p className="text-base text-black dark:text-gray-100 font-bold">
            فقط اذا اردت المشاركة في السحب على الجائزة الأولى املأ التالي.
          </p>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">البريد الإلكتروني (اختياري)</Label>
            <Input id="email" name="email" placeholder="أدخل بريدك الإلكتروني" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-lg">portfolio / تصاميمك (اختياري)</Label>
            <Input id="website" name="website" placeholder="أدخل رابط صفحة اعمالك" type="url" value={formData.website} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-lg">تخصص التصميم (اختياري)</Label>
            <div className="grid grid-cols-2 gap-2 space-y-2" dir="rtl">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uiux"
                name="specialty"
                value="تصميم UI/UX"
                checked={formData.specialty.includes('تصميم UI/UX')}
                onChange={handleChange}
              />
              <Label
                className="ml-2 text-base font-medium text-gray-950 dark:text-gray-400"
                htmlFor="uiux"
              >
                تصميم UI/UX
              </Label>
            </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                id="graphic"
                name="specialty"
                value="تصميم الجرافيك"
                checked={formData.specialty.includes('تصميم الجرافيك')}
                onChange={handleChange}
              />
              <Label
                className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
                htmlFor="graphic"
              >
                تصميم الجرافيك
              </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="web" name="specialty" value="تصميم الويب" checked={formData.specialty.includes( 'تصميم الويب')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="web">
                  تصميم الويب
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="product" name="specialty" value="تصميم المنتج و التفليف" checked={formData.specialty.includes('تصميم المنتج و التفليف')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="product">
                  تصميم المنتج و التفليف
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="illustration" name="specialty" value="الرسم التوضيحي (الإليستريشن)" checked={formData.specialty.includes('الرسم التوضيحي (الإليستريشن)')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="illustration">
                  الرسم التوضيحي (الإليستريشن)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="motiongraphics" name="specialty" value="رسوم متحركة (موشن جرافيكس)" checked={formData.specialty.includes('رسوم متحركة (موشن جرافيكس)')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="motiongraphics">
                  رسوم متحركة (موشن جرافيكس)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="videoediting" name="specialty" value="مونتاج الفيديو" checked={formData.specialty.includes('مونتاج الفيديو')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="videoediting">
                  مونتاج الفيديو
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox className="rounded text-blue-500" id="photography" name="specialty" value="التصوير الفوتوغرافي" checked={formData.specialty.includes('التصوير الفوتوغرافي')} onChange={handleChange} />
                <Label className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400" htmlFor="photography">
                  التصوير الفوتوغرافي
                </Label>
              </div>
            </div>
          </div>
          <Button className="w-full" type="submit">
            أدخل للفوز والترقية!
          </Button>
        </div>
      </form>
    </div>
  )
}
