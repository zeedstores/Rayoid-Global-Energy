
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link, Navigate } from 'react-router';
import { adminSections } from '../data/site';
import { Brand } from '../components/Brand';
import { supabase } from '../lib/supabase';

type DashboardStats = {
  projects: number;
  services: number;
  enquiries: number;
};

type ServiceRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
};

type ProjectRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  is_published: boolean;
};

type ContentRecord = ServiceRecord | ProjectRecord;

type EnquiryRecord = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

type ContentForm = {
  title: string;
  description: string;
  location: string;
  is_published: boolean;
};

type CompanySettings = {
  company_name: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
};

type SocialSettings = {
  meta_title: string;
  meta_description: string;
  website_url: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  x: string;
};

const emptyForm: ContentForm = {
  title: '',
  description: '',
  location: '',
  is_published: true,
};

const defaultCompanySettings: CompanySettings = {
  company_name: '',
  phone: '',
  whatsapp: '',
  address: '',
  email: '',
};

const defaultSocialSettings: SocialSettings = {
  meta_title: '',
  meta_description: '',
  website_url: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  x: '',
};

const enquiryStatuses = ['New', 'Contacted', 'In Progress', 'Resolved'];

const IMAGE_BUCKET = 'website-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// These sections are intentionally removed from the dashboard.
const removedSections = ['Media Library', 'Homepage Content'];

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isValidOptionalUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

async function uploadImage(file: File, folder: string) {
  if (!allowedImageTypes.includes(file.type)) {
    throw new Error('Choose a JPEG, PNG, WebP or GIF image.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 5 MB or smaller.');
  }

  if (file.size === 0) {
    throw new Error('The selected image is empty.');
  }

  const safeFilename = file.name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-');

  const filePath = `${folder}/${crypto.randomUUID()}-${safeFilename}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export default function AdminPage() {
  const [active, setActive] = useState('Overview');
  const [notice, setNotice] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    services: 0,
    enquiries: 0,
  });

  const visibleSections = adminSections.filter(
    (section) => !removedSections.includes(section),
  );

  const refreshStats = useCallback(async () => {
    const [
      { count: projects, error: projectsError },
      { count: services, error: servicesError },
      { count: enquiries, error: enquiriesError },
    ] = await Promise.all([
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true),
      supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true }),
    ]);

    if (projectsError || servicesError || enquiriesError) {
      setNotice(
        'Unable to load dashboard counts. Check your database permissions.',
      );
      return;
    }

    setStats({
      projects: projects ?? 0,
      services: services ?? 0,
      enquiries: enquiries ?? 0,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkAdminAccess() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError || !session) {
          setAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        const { data: admin, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!mounted) return;

        if (adminError || !admin) {
          setAuthenticated(false);
          setCheckingAuth(false);

          if (adminError) {
            console.error('Admin authorization check failed:', adminError);
            setNotice(
              'Unable to verify admin access. Check the admin_users table and its RLS policies.',
            );
          }
          return;
        }

        setAuthenticated(true);
        setCheckingAuth(false);
        await refreshStats();
      } catch (error) {
        if (!mounted) return;

        console.error('Admin access check failed:', error);
        setAuthenticated(false);
        setCheckingAuth(false);
        setNotice('Unable to verify admin access. Please try again.');
      }
    }

    void checkAdminAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        if (mounted) void checkAdminAccess();
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshStats]);

  function navigateTo(section: string) {
    setActive(section);
    setNotice('');
  }

  async function signOut() {
    setNotice('');
    const { error } = await supabase.auth.signOut();

    if (error) setNotice(`Unable to sign out: ${error.message}`);
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f2ed] text-ink">
        Checking admin access...
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f0f2ed] text-ink lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-line bg-white p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-7">
        <Brand compact />

        <div className="mt-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Admin dashboard
          </p>
          <p className="mt-2 text-sm text-muted">
            Manage your website content and settings.
          </p>
        </div>

        <nav
          className="mt-8 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1"
          aria-label="Admin sections"
        >
          {visibleSections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => navigateTo(section)}
              aria-current={active === section ? 'page' : undefined}
              className={`admin-nav ${
                active === section
                  ? 'bg-brand text-white'
                  : 'text-muted hover:bg-soft hover:text-ink'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>

        <div className="mt-8 border-t border-line pt-5">
          <Link to="/" className="text-sm font-bold text-brand">
            ← View website
          </Link>

          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-4 block text-sm font-bold text-red-600 hover:text-red-800"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 p-5 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="eyebrow text-brand">Website manager</p>
            <h1 className="mt-3 font-display text-4xl font-semibold">
              {active}
            </h1>
          </div>

          {notice && (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 break-words border-l-2 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950"
            >
              {notice}
            </div>
          )}

          {active === 'Overview' ? (
            <Overview stats={stats} onNavigate={navigateTo} />
          ) : active === 'Services' ? (
            <ContentManager
              kind="services"
              onNotice={setNotice}
              onChanged={refreshStats}
            />
          ) : active === 'Projects' ? (
            <ContentManager
              kind="projects"
              onNotice={setNotice}
              onChanged={refreshStats}
            />
          ) : active === 'Enquiries' ? (
            <EnquiriesManager
              onNotice={setNotice}
              onChanged={refreshStats}
            />
          ) : active === 'Company Settings' ? (
            <CompanySettingsManager onNotice={setNotice} />
          ) : active === 'SEO and Social Links' ? (
            <SocialSettingsManager onNotice={setNotice} />
          ) : active === 'Account and Security' ? (
            <AccountSecurityManager onNotice={setNotice} />
          ) : (
            <div className="mt-10 border border-line bg-white p-8">
              <h2 className="text-xl font-semibold">{active}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                This section is not available.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Overview({
  stats,
  onNavigate,
}: {
  stats: DashboardStats;
  onNavigate: (section: string) => void;
}) {
  const cards = [
    ['Published projects', stats.projects],
    ['Published services', stats.services],
    ['Total enquiries', stats.enquiries],
  ] as const;

  return (
    <div className="mt-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-line bg-white p-6">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-5 font-display text-5xl font-semibold">{value}</p>
            <p className="mt-3 text-xs text-muted">Live database count</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-dark p-8 text-white">
        <p className="eyebrow text-solar">Quick actions</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            ['Manage projects', 'Projects'],
            ['Manage services', 'Services'],
            ['View enquiries', 'Enquiries'],
            ['Company settings', 'Company Settings'],
            ['SEO & social links', 'SEO and Social Links'],
            ['Account security', 'Account and Security'],
          ].map(([label, section]) => (
            <button
              key={section}
              type="button"
              onClick={() => onNavigate(section)}
              className="border border-white/20 px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-ink"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 border border-line bg-white p-5 sm:p-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  maxLength,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand disabled:opacity-60"
      />
    </label>
  );
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="button-base bg-brand text-white hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span>{saving ? 'Saving...' : 'Save changes'}</span>
    </button>
  );
}


function CompanySettingsManager({
  onNotice,
}: {
  onNotice: (message: string) => void;
}) {
  const [form, setForm] = useState<CompanySettings>(defaultCompanySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'company')
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        onNotice(`Unable to load company settings: ${error.message}`);
      } else if (data?.value) {
        setForm({
          ...defaultCompanySettings,
          ...(data.value as Partial<CompanySettings>),
        });
      }

      setLoading(false);
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, [onNotice]);

  function update<K extends keyof CompanySettings>(
    key: K,
    value: CompanySettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    onNotice('');
    setSaving(true);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Please sign in as an administrator to save settings.');
      }

      const { error } = await supabase.from('site_settings').upsert(
        {
          key: 'company',
          value: form,
          updated_at: new Date().toISOString(),
          updated_by: authData.user.id,
        },
        { onConflict: 'key' },
      );

      if (error) throw error;

      onNotice(
        'Company settings saved successfully. Refresh the public website to load the updated details.',
      );
    } catch (error) {
      onNotice(
        `Unable to save company settings: ${getErrorMessage(
          error,
          'Please try again.',
        )}`,
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="mt-10 text-sm text-muted">
        Loading company settings...
      </p>
    );
  }

  return (
    <div className="mt-4">
      <SettingsCard
        title="Company information"
        description="Update the business contact details shown to customers."
      >
        <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Company name"
            value={form.company_name}
            onChange={(value) => update('company_name', value)}
            placeholder="Raynoid Global Energy Ltd"
            required
            maxLength={200}
          />

          <Field
            label="Business email"
            value={form.email}
            onChange={(value) => update('email', value)}
            placeholder="info@example.com"
            type="email"
            maxLength={254}
          />

          <Field
            label="Phone number"
            value={form.phone}
            onChange={(value) => update('phone', value)}
            placeholder="+234..."
            type="tel"
            maxLength={40}
          />

          <Field
            label="WhatsApp number"
            value={form.whatsapp}
            onChange={(value) => update('whatsapp', value)}
            placeholder="234..."
            type="tel"
            maxLength={40}
          />

          <div className="sm:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Company address
              </span>

              <textarea
                value={form.address}
                onChange={(event) =>
                  update('address', event.currentTarget.value)
                }
                rows={3}
                maxLength={1000}
                placeholder="Enter the business address"
                className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand"
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <SaveButton saving={saving} />
          </div>
        </form>
      </SettingsCard>
    </div>
  );
}


function SocialSettingsManager({
  onNotice,
}: {
  onNotice: (message: string) => void;
}) {
  const [form, setForm] = useState<SocialSettings>(defaultSocialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'seo_social')
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        onNotice(`Unable to load SEO and social settings: ${error.message}`);
      } else if (data?.value) {
        setForm({
          ...defaultSocialSettings,
          ...(data.value as Partial<SocialSettings>),
        });
      }

      setLoading(false);
    }

    void loadSettings();
    return () => {
      mounted = false;
    };
  }, [onNotice]);

  function update<K extends keyof SocialSettings>(
    key: K,
    value: SocialSettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    onNotice('');

    const urls = [
      ['Website URL', form.website_url],
      ['Facebook', form.facebook],
      ['Instagram', form.instagram],
      ['LinkedIn', form.linkedin],
      ['YouTube', form.youtube],
      ['TikTok', form.tiktok],
      ['X', form.x],
    ] as const;

    const invalid = urls.find(([, value]) => !isValidOptionalUrl(value));

    if (invalid) {
      onNotice(`${invalid[0]} must be a valid http:// or https:// URL.`);
      return;
    }

    setSaving(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const { error } = await supabase.from('site_settings').upsert(
        {
          key: 'seo_social',
          value: form,
          updated_at: new Date().toISOString(),
          updated_by: authData.user?.id ?? null,
        },
        { onConflict: 'key' },
      );

      if (error) throw error;

      onNotice(
        'SEO and social links saved. The public website must read these settings before the links and metadata update there.',
      );
    } catch (error) {
      onNotice(
        `Unable to save SEO and social settings: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="mt-10 text-sm text-muted">
        Loading SEO and social settings...
      </p>
    );
  }

  return (
    <div className="mt-4">
      <SettingsCard
        title="Search engine settings"
        description="Manage the website title, description, website URL and social media links."
      >
        <form onSubmit={handleSubmit} className="grid gap-5">
          <Field
            label="Website URL"
            value={form.website_url}
            onChange={(value) => update('website_url', value)}
            placeholder="https://www.example.com"
            type="url"
            maxLength={500}
          />
          <Field
            label="SEO page title"
            value={form.meta_title}
            onChange={(value) => update('meta_title', value)}
            placeholder="Company name | Solar energy solutions"
            maxLength={70}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              SEO description
            </span>
            <textarea
              value={form.meta_description}
              onChange={(event) =>
                update('meta_description', event.currentTarget.value)
              }
              rows={4}
              maxLength={320}
              placeholder="Briefly describe the company and its services."
              className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand"
            />
            <span className="mt-1 block text-xs text-muted">
              {form.meta_description.length}/320 characters
            </span>
          </label>

          <div className="border-t border-line pt-6">
            <h3 className="text-lg font-semibold">Social media links</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Enter each account's full public URL, including https://. Leave
              unused accounts empty.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Facebook"
              value={form.facebook}
              onChange={(value) => update('facebook', value)}
              placeholder="https://facebook.com/yourpage"
              type="url"
              maxLength={500}
            />
            <Field
              label="Instagram"
              value={form.instagram}
              onChange={(value) => update('instagram', value)}
              placeholder="https://instagram.com/youraccount"
              type="url"
              maxLength={500}
            />
            <Field
              label="LinkedIn"
              value={form.linkedin}
              onChange={(value) => update('linkedin', value)}
              placeholder="https://linkedin.com/company/..."
              type="url"
              maxLength={500}
            />
            <Field
              label="YouTube"
              value={form.youtube}
              onChange={(value) => update('youtube', value)}
              placeholder="https://youtube.com/@yourchannel"
              type="url"
              maxLength={500}
            />
            <Field
              label="TikTok"
              value={form.tiktok}
              onChange={(value) => update('tiktok', value)}
              placeholder="https://tiktok.com/@youraccount"
              type="url"
              maxLength={500}
            />
            <Field
              label="X"
              value={form.x}
              onChange={(value) => update('x', value)}
              placeholder="https://x.com/youraccount"
              type="url"
              maxLength={500}
            />
          </div>

          <div>
            <SaveButton saving={saving} />
          </div>
        </form>
      </SettingsCard>
    </div>
  );
}

function AccountSecurityManager({
  onNotice,
}: {
  onNotice: (message: string) => void;
}) {
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error) {
        onNotice(`Unable to load your account: ${error.message}`);
        return;
      }

      setCurrentEmail(data.user?.email ?? '');
    }

    void loadCurrentUser();
    return () => {
      mounted = false;
    };
  }, [onNotice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    onNotice('');

    const emailChanged =
      newEmail.trim().toLowerCase() !== currentEmail.toLowerCase();
    const passwordChanged = Boolean(newPassword);

    if (!emailChanged && !passwordChanged) {
      onNotice('Enter a new email address or a new password.');
      return;
    }

    if (!currentPassword) {
      onNotice('Enter your current password to confirm this change.');
      return;
    }

    if (passwordChanged && newPassword.length < 8) {
      onNotice('Your new password must be at least 8 characters long.');
      return;
    }

    if (passwordChanged && newPassword !== confirmPassword) {
      onNotice('The new password and confirmation do not match.');
      return;
    }

    if (emailChanged && !newEmail.trim()) {
      onNotice('Enter a valid new email address.');
      return;
    }

    setSaving(true);

    try {
      // Verify the current password before changing credentials.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error(
          'Your current password could not be verified. Check it and try again.',
        );
      }

      const updates: { email?: string; password?: string } = {};
      if (emailChanged) updates.email = newEmail.trim();
      if (passwordChanged) updates.password = newPassword;

      const { error: updateError } = await supabase.auth.updateUser(updates);
      if (updateError) throw updateError;

      if (emailChanged) {
        setCurrentEmail(newEmail.trim());
        setNewEmail('');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      onNotice(
        emailChanged && passwordChanged
          ? 'Account update submitted. Check your inbox for any required email confirmation.'
          : emailChanged
            ? 'Email change submitted. Check your inbox for any required confirmation.'
            : 'Password changed successfully.',
      );
    } catch (error) {
      onNotice(
        `Unable to update account: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4">
      <SettingsCard
        title="Login credentials"
        description="Update the administrator email or password. Your current password is required to confirm the change."
      >
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <p className="mb-2 text-sm font-semibold">Current login email</p>
            <p className="break-all border border-line bg-soft px-4 py-3 text-sm">
              {currentEmail || 'Loading account email...'}
            </p>
          </div>

          <Field
            label="New login email (optional)"
            value={newEmail}
            onChange={setNewEmail}
            placeholder="new-email@example.com"
            type="email"
            maxLength={254}
          />

          <Field
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter your current password"
            type="password"
            required
            maxLength={256}
          />

          <div className="border-t border-line pt-6">
            <h3 className="text-lg font-semibold">Change password</h3>
            <p className="mt-2 text-sm text-muted">
              Leave the new password fields empty if you only want to change
              your email.
            </p>
          </div>

          <Field
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="At least 8 characters"
            type="password"
            maxLength={256}
          />

          <Field
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Enter the new password again"
            type="password"
            maxLength={256}
          />

          <div>
            <SaveButton saving={saving} />
          </div>

          <p className="text-xs leading-5 text-muted">
            If email confirmation is enabled in Supabase, your new email may
            not become active until you complete the confirmation process.
          </p>
        </form>
      </SettingsCard>
    </div>
  );
}

function ContentManager({
  kind,
  onNotice,
  onChanged,
}: {
  kind: 'services' | 'projects';
  onNotice: (message: string) => void;
  onChanged: () => Promise<void>;
}) {
  const isProject = kind === 'projects';
  const noun = isProject ? 'project' : 'service';
  const plural = isProject ? 'projects' : 'services';

  const [records, setRecords] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [form, setForm] = useState<ContentForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);

    try {
      if (isProject) {
        const { data, error } = await supabase
          .from('projects')
          .select(
            'id, title, slug, description, location, image_url, is_published',
          )
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecords((data ?? []) as ProjectRecord[]);
      } else {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, slug, description, image_url, is_published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRecords((data ?? []) as ServiceRecord[]);
      }
    } catch (error) {
      onNotice(
        `Unable to load ${plural}: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setLoading(false);
    }
  }, [isProject, onNotice, plural]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  function startAdd() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormOpen(true);
    onNotice('');
  }

  function startEdit(record: ContentRecord) {
    setEditing(record);
    setForm({
      title: record.title,
      description: record.description ?? '',
      location: 'location' in record ? record.location ?? '' : '',
      is_published: record.is_published,
    });
    setImageFile(null);
    setFormOpen(true);
    onNotice('');
  }

  function cancelForm() {
    setFormOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    onNotice('');

  const title = form.title.trim();
const baseSlug = makeSlug(title);

let slug = baseSlug;
let suffix = 2;

while (
  records.some(
    (record) =>
      record.slug === slug && record.id !== editing?.id,
  )
) {
  slug = `${baseSlug}-${suffix}`;
  suffix++;
}

    if (!title || !slug) {
      onNotice(`Please enter a valid ${noun} title.`);
      return;
    }

    if (!editing && !imageFile) {
      onNotice(`Please choose an image for this ${noun}.`);
      return;
    }

    if (imageFile) {
      if (!allowedImageTypes.includes(imageFile.type)) {
        onNotice('Choose a JPEG, PNG, WebP or GIF image.');
        return;
      }

      if (imageFile.size === 0 || imageFile.size > MAX_IMAGE_SIZE) {
        onNotice('Choose an image larger than 0 bytes and no larger than 5 MB.');
        return;
      }
    }

    setSaving(true);

    try {
      let imageUrl = editing?.image_url ?? null;

      if (imageFile) {
        imageUrl = await uploadImage(
          imageFile,
          isProject ? 'projects' : 'services',
        );
      }

      const commonData = {
        title,
        slug,
        description: form.description.trim() || null,
        image_url: imageUrl,
        is_published: form.is_published,
      };

      if (isProject) {
        const projectData = {
          ...commonData,
          location: form.location.trim() || null,
        };

        const result = editing
          ? await supabase
              .from('projects')
              .update(projectData)
              .eq('id', editing.id)
          : await supabase.from('projects').insert(projectData);

        if (result.error) throw result.error;
      } else {
        const result = editing
          ? await supabase
              .from('services')
              .update(commonData)
              .eq('id', editing.id)
          : await supabase.from('services').insert(commonData);

        if (result.error) throw result.error;
      }

      const wasEditing = Boolean(editing);
      cancelForm();

      onNotice(
        `${noun.charAt(0).toUpperCase() + noun.slice(1)} ${
          wasEditing ? 'updated' : 'added'
        } successfully.`,
      );

      await loadRecords();
      await onChanged();
    } catch (error) {
      onNotice(
        `Unable to save ${noun}: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(record: ContentRecord) {
    if (busyId || saving) return;

    onNotice('');
    setBusyId(record.id);

    try {
      const result = isProject
        ? await supabase
            .from('projects')
            .update({ is_published: !record.is_published })
            .eq('id', record.id)
        : await supabase
            .from('services')
            .update({ is_published: !record.is_published })
            .eq('id', record.id);

      if (result.error) throw result.error;

      onNotice(
        `${noun.charAt(0).toUpperCase() + noun.slice(1)} ${
          record.is_published ? 'unpublished' : 'published'
        } successfully.`,
      );

      await loadRecords();
      await onChanged();
    } catch (error) {
      onNotice(
        `Unable to change publish status: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteRecord(record: ContentRecord) {
    if (busyId || saving) return;

    const confirmed = window.confirm(
      `Delete "${record.title}"? This removes the ${noun} record from the database.`,
    );

    if (!confirmed) return;

    onNotice('');
    setBusyId(record.id);

    try {
      const result = isProject
        ? await supabase.from('projects').delete().eq('id', record.id)
        : await supabase.from('services').delete().eq('id', record.id);

      if (result.error) throw result.error;

      if (editing?.id === record.id) cancelForm();

      onNotice(`${noun.charAt(0).toUpperCase() + noun.slice(1)} deleted.`);
      await loadRecords();
      await onChanged();
    } catch (error) {
      onNotice(
        `Unable to delete ${noun}: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isProject ? 'Project records' : 'Service records'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Add, edit, publish, unpublish and delete {plural}.
          </p>
        </div>

        <button
          type="button"
          onClick={startAdd}
          disabled={saving}
          className="button-base bg-brand text-white hover:bg-deep disabled:opacity-60"
        >
          <span>+ Add {noun}</span>
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 border border-line bg-white p-5 sm:p-8"
        >
          <h3 className="font-display text-2xl font-semibold">
            {editing ? `Edit ${noun}` : `Add a ${noun}`}
          </h3>

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Image {!editing && '*'}
              </span>

              {editing?.image_url && (
                <img
                  src={editing.image_url}
                  alt={editing.title}
                  className="mb-3 h-40 w-full max-w-sm object-cover"
                />
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required={!editing?.image_url}
                disabled={saving}
                onChange={(event) =>
                  setImageFile(event.currentTarget.files?.[0] ?? null)
                }
                className="block w-full rounded border border-line bg-white p-3 text-sm"
              />

              <span className="mt-2 block text-xs text-muted">
                JPEG, PNG, WebP or GIF. Maximum 5 MB.
                {editing?.image_url
                  ? ' Leave empty to keep the current image.'
                  : ''}
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Title *</span>
              <input
                type="text"
                required
                maxLength={150}
                value={form.title}
                disabled={saving}
                onChange={(event) =>
                  setForm({ ...form, title: event.currentTarget.value })
                }
                placeholder={`Enter ${noun} title`}
                className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand"
              />
            </label>

            {isProject && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">
                  Location
                </span>
                <input
                  type="text"
                  maxLength={200}
                  value={form.location}
                  disabled={saving}
                  onChange={(event) =>
                    setForm({ ...form, location: event.currentTarget.value })
                  }
                  placeholder="e.g. Onitsha, Anambra"
                  className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Description
              </span>
              <textarea
                value={form.description}
                disabled={saving}
                maxLength={10000}
                onChange={(event) =>
                  setForm({ ...form, description: event.currentTarget.value })
                }
                rows={4}
                placeholder={`Describe this ${noun}...`}
                className="w-full border border-line bg-white px-4 py-3 outline-none focus:border-brand"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.is_published}
                disabled={saving}
                onChange={(event) =>
                  setForm({
                    ...form,
                    is_published: event.currentTarget.checked,
                  })
                }
                className="size-4 accent-brand"
              />
              Publish this {noun}
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="button-base bg-brand text-white hover:bg-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {saving
                  ? 'Saving...'
                  : editing
                    ? `Update ${noun}`
                    : `Add ${noun}`}
              </span>
            </button>

            <button
              type="button"
              onClick={cancelForm}
              disabled={saving}
              className="button-base border border-line bg-white text-ink disabled:opacity-60"
            >
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden border border-line bg-white">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading {plural}...</p>
        ) : records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">No {plural} found.</p>
            <p className="mt-2 text-sm text-muted">
              Add your first {noun} using the button above.
            </p>
          </div>
        ) : (
          records.map((record, index) => (
            <div
              key={record.id}
              className="grid gap-4 border-b border-line p-5 last:border-0 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center"
            >
              {record.image_url ? (
                <img
                  src={record.image_url}
                  alt={record.title}
                  className="size-14 object-cover"
                />
              ) : (
                <div className="grid size-14 place-items-center bg-soft text-xs text-muted">
                  No image
                </div>
              )}

              <div>
                <p className="font-semibold">
                  {index + 1}. {record.title}
                </p>

                {'location' in record && record.location && (
                  <p className="mt-1 text-xs text-muted">{record.location}</p>
                )}

                <p className="mt-1 break-all text-xs text-muted">
                  /{record.slug}
                </p>

                <span
                  className={`mt-2 inline-block text-xs font-semibold ${
                    record.is_published ? 'text-green-700' : 'text-amber-700'
                  }`}
                >
                  {record.is_published ? 'Published' : 'Unpublished'}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
                <button
                  type="button"
                  disabled={Boolean(busyId) || saving}
                  onClick={() => startEdit(record)}
                  className="text-brand hover:underline disabled:opacity-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  disabled={Boolean(busyId) || saving}
                  onClick={() => void togglePublished(record)}
                  className="text-brand hover:underline disabled:opacity-50"
                >
                  {busyId === record.id
                    ? 'Updating...'
                    : record.is_published
                      ? 'Unpublish'
                      : 'Publish'}
                </button>

                <button
                  type="button"
                  disabled={Boolean(busyId) || saving}
                  onClick={() => void deleteRecord(record)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EnquiriesManager({
  onNotice,
  onChanged,
}: {
  onNotice: (message: string) => void;
  onChanged: () => Promise<void>;
}) {
  const [records, setRecords] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<EnquiryRecord | null>(null);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select(
          'id, full_name, email, phone, service, message, status, created_at',
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords((data ?? []) as EnquiryRecord[]);
    } catch (error) {
      onNotice(
        `Unable to load enquiries: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setLoading(false);
    }
  }, [onNotice]);

  useEffect(() => {
    void loadEnquiries();
  }, [loadEnquiries]);

  async function updateStatus(id: string, status: string) {
    if (updatingId) return;

    onNotice('');
    setUpdatingId(id);

    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRecords((current) =>
        current.map((record) =>
          record.id === id ? { ...record, status } : record,
        ),
      );

      setSelected((current) =>
        current?.id === id ? { ...current, status } : current,
      );

      onNotice('Enquiry status updated.');
      await onChanged();
    } catch (error) {
      onNotice(
        `Unable to update enquiry: ${getErrorMessage(error, 'Please try again.')}`,
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Customer enquiries</h2>
        <p className="mt-1 text-sm text-muted">
          Review quote requests and track your follow-up progress.
        </p>
      </div>

      {selected && (
        <div className="mb-6 border border-line bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">
                {selected.full_name}
              </h3>
              <p className="mt-2 text-sm text-muted">
                Received {formatDate(selected.created_at)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-sm font-semibold text-brand hover:underline"
            >
              Close details
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase text-muted">Email</p>
              <a
                href={`mailto:${selected.email}`}
                className="mt-1 block break-all text-sm text-brand hover:underline"
              >
                {selected.email}
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-muted">Phone</p>
              {selected.phone ? (
                <a
                  href={`tel:${selected.phone}`}
                  className="mt-1 block text-sm text-brand hover:underline"
                >
                  {selected.phone}
                </a>
              ) : (
                <p className="mt-1 text-sm">Not provided</p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-muted">
                Requested service
              </p>
              <p className="mt-1 text-sm">
                {selected.service || 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-muted">Status</p>
              <p className="mt-1 text-sm">{selected.status || 'New'}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase text-muted">Message</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7">
              {selected.message || 'No message provided.'}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden border border-line bg-white">
        {loading ? (
          <p className="p-6 text-sm text-muted">Loading enquiries...</p>
        ) : records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">No enquiries yet.</p>
            <p className="mt-2 text-sm text-muted">
              Customer quote requests will appear here when submitted.
            </p>
          </div>
        ) : (
          records.map((record) => {
            const currentStatus = record.status || 'New';
            const options = enquiryStatuses.includes(currentStatus)
              ? enquiryStatuses
              : [currentStatus, ...enquiryStatuses];

            return (
              <div
                key={record.id}
                className="grid gap-4 border-b border-line p-5 last:border-0 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{record.full_name}</p>
                  <p className="mt-1 break-all text-sm text-muted">
                    {record.email}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {record.service || 'General enquiry'} ·{' '}
                    {formatDate(record.created_at)}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelected(record)}
                    className="mt-3 text-sm font-semibold text-brand hover:underline"
                  >
                    View message
                  </button>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase text-muted">
                    Status
                  </span>
                  <select
                    value={currentStatus}
                    disabled={updatingId === record.id}
                    onChange={(event) =>
                      void updateStatus(record.id, event.currentTarget.value)
                    }
                    className="w-full min-w-40 border border-line bg-white px-3 py-2 text-sm disabled:opacity-60"
                  >
                    {options.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {updatingId === record.id && (
                    <span className="mt-1 block text-xs text-muted">
                      Updating status...
                    </span>
                  )}
                </label>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
