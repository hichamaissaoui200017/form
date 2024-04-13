"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Noto_Kufi_Arabic} from '@next/font/google'
import { sendToTelegram } from '@/lib/sendToTelegram';
import { pageview } from '@/lib/pageview';
import React, { useState, useEffect } from 'react';
import getUserIP from '../../lib/getUserIP';
import { sha256 } from "js-sha256";
import * as fbq from "../../lib/fpixel";
const additionalData = {};
const eventID: string = crypto.randomUUID();
const eventID2: string = crypto.randomUUID();
const rubik = Noto_Kufi_Arabic({ subsets: ['arabic'],
 weight:['500','600','700'],
 })
 export function Form() {
  useEffect(() => {
    pageview(eventID2);
  }, []);
const [formData, setFormData] = useState<{
  facebook: string;
  group: string;
  email: string;
  website: string;
  specialty: string[];
}>({
  facebook: '',
  group: '',
  email: '',
  website: '',
  specialty: [],
});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const initialCheckboxState = {
    'تصميم UI/UX': false,
    'تصميم الجرافيك': false,
    'مطور ويب': false,
    'تصميم المنتج و التفليف': false,
    'الرسم التوضيحي (الإليستريشن)': false,
    'رسوم متحركة (موشن جرافيكس)': false,
    'مونتاج الفيديو': false,
    'التصوير الفوتوغرافي': false,
  };
  
  // Use the initial state in the useState hook
  const [checkboxState, setCheckboxState] = useState(initialCheckboxState);
  
  // Update the handleCheckboxChange function
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCheckboxState(prevState => ({ ...prevState, [name]: checked }));
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

const selectedSpecialties = Object.keys(checkboxState).filter(
  (specialty: string) => checkboxState[specialty as keyof typeof checkboxState]
);

  // Merge selectedSpecialties into the specialty field in formData
  const updatedFormData = {
    ...formData,
    specialty: Array.isArray(formData.specialty)
      ? [...(formData.specialty as string[]), ...selectedSpecialties]
      : selectedSpecialties,
  };

  // Now use updatedFormData instead of formData
  const eventTime = Math.floor(Date.now() / 1000);
  const userIp: string = (await getUserIP()).toString();
  const message = `
    profile: ${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
    IP: ${userIp}
    eventTime: ${eventTime}
    eventID: ${eventID}
    اسمك على الفايسبوك: "${formData.facebook}" \n
    اسم المجموعة: "${formData.group}" \n
    البريد الإلكتروني: "${formData.email}" \n
    portfolio / تصاميمك: "${formData.website}"\n
    تخصص التصميم: ${(updatedFormData.specialty as string[]).join(', ')}
  `;
  const email: string = Array.isArray(formData.email) ? formData.email[0] : formData.email;
const messageCompleteRegistration = {
  "data": [
    {
      "event_name": "CompleteRegistration",
      "event_time": eventTime,
      "action_source": "website",
      "event_source_url": window.location.href,
      "event_id": eventID,
      "user_data": {
        "em": [
          sha256(email)
        ],
        "client_ip_address": userIp,
        "client_user_agent": navigator.userAgent
      }
    }
  ],
  "test_event_code": "TEST77801"
};

    console.log(formData)
    await sendToTelegram(message,messageCompleteRegistration, eventID);
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
          <Input id="facebook" name="facebook" placeholder="أدخل رابط حسابك على الفيسبوك" required type="text" value={formData.facebook} onChange={handleInputChange} />
          <p className="text-base text-gray-500 dark:text-gray-400">
            ( نحن بحاجة إلى هذا حتى نتمكن من الاتصال بك عندما تفوز.)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="group" className="text-lg">
            اسم المجموعة
            <span className="text-red-500">*</span>
          </Label>
          <Input id="group" name="group" placeholder="أدخل اسم مجموعتك" required type="text" value={formData.group} onChange={handleInputChange} />
          <p className="text-base text-gray-500 dark:text-gray-400">اسم المجموعة التي تشارك منها!.</p>
        </div>
        <div className="space-y-4">
          <p className="text-base text-black dark:text-gray-100 font-bold">
            فقط اذا اردت المشاركة في السحب على الجائزة الأولى املأ التالي.
          </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">البريد الإلكتروني (اختياري)</Label>
            <Input id="email" name="email" placeholder="أدخل بريدك الإلكتروني" type="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="text-lg">portfolio / تصاميمك (اختياري)</Label>
            <Input id="website" name="website" placeholder="أدخل رابط صفحة اعمالك" type="url" value={formData.website} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="text-lg">تخصص التصميم (اختياري)</Label>
            <div className="grid grid-cols-2 gap-2 space-y-2" dir="rtl">
            <div className="flex items-center space-x-2">
            <Checkbox
            id="uiux"
            name="specialty"
            value="تصميم UI/UX"
            checked={checkboxState['تصميم UI/UX']}
            onCheckedChange={(checked) => handleCheckboxChange('تصميم UI/UX', checked)}
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
    checked={checkboxState['تصميم الجرافيك']}
    onCheckedChange={(checked) => handleCheckboxChange('تصميم الجرافيك', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="graphic"
  >
    تصميم الجرافيك
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="web"
    name="specialty"
    value="مطور ويب"
    checked={checkboxState['مطور ويب']}
    onCheckedChange={(checked) => handleCheckboxChange('مطور ويب', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="web"
  >
    مطور ويب
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="product"
    name="specialty"
    value="تصميم المنتج و التفليف"
    checked={checkboxState['تصميم المنتج و التفليف']}
    onCheckedChange={(checked) => handleCheckboxChange('تصميم المنتج و التفليف', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="product"
  >
    تصميم المنتج و التفليف
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="illustration"
    name="specialty"
    value="الرسم التوضيحي (الإليستريشن)"
    checked={checkboxState['الرسم التوضيحي (الإليستريشن)']}
    onCheckedChange={(checked) => handleCheckboxChange('الرسم التوضيحي (الإليستريشن)', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="illustration"
  >
    الرسم التوضيحي (الإليستريشن)
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="motiongraphics"
    name="specialty"
    value="رسوم متحركة (موشن جرافيكس)"
    checked={checkboxState['رسوم متحركة (موشن جرافيكس)']}
    onCheckedChange={(checked) => handleCheckboxChange('رسوم متحركة (موشن جرافيكس)', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="motiongraphics"
  >
    رسوم متحركة (موشن جرافيكس)
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="videoediting"
    name="specialty"
    value="مونتاج الفيديو"
    checked={checkboxState['مونتاج الفيديو']}
    onCheckedChange={(checked) => handleCheckboxChange('مونتاج الفيديو', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="videoediting"
  >
    مونتاج الفيديو
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="photography"
    name="specialty"
    value="التصوير الفوتوغرافي"
    checked={checkboxState['التصوير الفوتوغرافي']}
    onCheckedChange={(checked) => handleCheckboxChange('التصوير الفوتوغرافي', checked)}
  />
  <Label
    className="ml-2 text-base font-medium text-gray-900 dark:text-gray-400"
    htmlFor="photography"
  >
    التصوير الفوتوغرافي
  </Label>
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
