
import { useEffect, useState } from 'react';
import { company as defaultCompany } from '../data/site';
import { supabase } from '../lib/supabase';

type CompanySettings = {
  company_name?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  email?: string;
};

export function useCompanySettings() {
  const [settings, setSettings] = useState({
    ...defaultCompany,
  });

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'company')
        .maybeSingle();

      if (error) {
        console.error('Could not load company settings:', error.message);
        return;
      }

      if (!active || !data?.value) return;

      const saved = data.value as CompanySettings;
      const phone = saved.phone || defaultCompany.phone;
      const whatsapp = saved.whatsapp || defaultCompany.whatsapp;

      const toInternationalNumber = (value: string) => {
        const number = value.replace(/\D/g, '');

        if (number.startsWith('234')) return number;
        if (number.startsWith('0')) return `234${number.slice(1)}`;

        return number;
      };

      const whatsappNumber = toInternationalNumber(whatsapp);
      const phoneNumber = toInternationalNumber(phone);

      setSettings({
        ...defaultCompany,
        name: saved.company_name || defaultCompany.name,
        phone,
        phoneHref: `tel:+${phoneNumber}`,
        whatsapp,
        whatsappHref: `https://wa.me/${whatsappNumber}`,
        email: saved.email || defaultCompany.email,
        address: saved.address || defaultCompany.address,
      });
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  return settings;
}
