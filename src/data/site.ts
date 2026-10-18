export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  short: string;
  description: string;
  image: string;
  alt: string;
  benefits: string[];
};

export const company = {
  name: 'Raynoid Global Energy Ltd',
  tagline: 'Powering Today, Sustaining Tomorrow.',
  phone: '08066656915',
  phoneHref: 'tel:+2348066656915',
  whatsapp: '08125216619',
  whatsappHref:
    'https://wa.me/2348125216619?text=Hello%20Raynoid%20Global%20Energy%2C%20I%27d%20like%20to%20discuss%20a%20project.',
  email: 'raynoidglobalenergy@gmail.com',
  address: 'Plot 10 Unity Avenue, Idofabe Estate Community, by Elijah Bus Stop, Badagry, Lagos.',
  registration: 'RC 9574580',
};

export const images = {
  hero: 'https://images.unsplash.com/photo-1628353100822-0229ae96e820?auto=format&fit=crop&w=1800&q=86',
  lagos: 'https://images.unsplash.com/photo-1580239808575-21a119018fb4?auto=format&fit=crop&w=1800&q=84',
  solar: 'https://images.unsplash.com/photo-1635424824849-1b09bdcc55b1?auto=format&fit=crop&w=1400&q=82',
  cctv: 'https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?auto=format&fit=crop&w=1400&q=82',
  gate: 'https://images.unsplash.com/photo-1628353100822-0229ae96e820?auto=format&fit=crop&w=1400&q=82',
  fencing: 'https://images.unsplash.com/photo-1643297551340-19d8ad4f20ad?auto=format&fit=crop&w=1400&q=82',
  maintenance: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=82',
  controls: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1400&q=82',
};

export const services: Service[] = [
  {
    slug: 'solar-installation',
    title: 'Solar Installation',
    eyebrow: 'Power systems',
    short: 'Solar, inverter and battery systems planned around what you actually need to power.',
    description:
      'Raynoid plans and installs solar power systems for homes, shops, offices and larger sites. The process begins with what must stay powered and how the property is used—not a one-size-fits-all package.',
    image: images.solar,
    alt: 'Technician installing solar panels on a pitched roof',
    benefits: ['Property-led system planning', 'Clear installation scope', 'Maintenance options after installation'],
  },
  {
    slug: 'cctv-installation',
    title: 'CCTV Installation',
    eyebrow: 'Property security',
    short: 'See entrances, compounds and work areas clearly with cameras placed where they matter.',
    description:
      'CCTV installation begins with the areas that matter: entrances, boundaries and operational spaces. Raynoid helps define coverage and installs a practical system suited to the property.',
    image: images.cctv,
    alt: 'Exterior CCTV cameras mounted to a building',
    benefits: ['Coverage-led camera placement', 'Residential and commercial applications', 'Organised installation and handover'],
  },
  {
    slug: 'gate-automation',
    title: 'Gate Automation',
    eyebrow: 'Access control',
    short: 'Open and secure your gate with less stress and better control over access.',
    description:
      'Raynoid provides gate automation for properties that need controlled, convenient vehicle access. Site conditions and the existing gate are reviewed before the proposed solution is confirmed.',
    image: images.gate,
    alt: 'Modern gated driveway at a residential property',
    benefits: ['Site-specific review', 'Convenient controlled access', 'Support and maintenance planning'],
  },
  {
    slug: 'home-automation',
    title: 'Home Automation',
    eyebrow: 'Connected spaces',
    short: 'Bring selected lights, access and home systems under simpler everyday control.',
    description:
      'Home automation should simplify how a property works. Raynoid helps identify the systems to connect and plans a focused solution around practical routines and control needs.',
    image: images.controls,
    alt: 'Neatly organised electrical controls inside a panel',
    benefits: ['Requirements-led planning', 'Practical system integration', 'Clear user handover'],
  },
  {
    slug: 'perimeter-fencing',
    title: 'Perimeter Fencing',
    eyebrow: 'Boundary security',
    short: 'Strengthen the boundary around your home, business or site with a clear security plan.',
    description:
      'Raynoid assesses the property boundary and discusses the appropriate perimeter security approach before installation. Scope and access needs are agreed before work begins.',
    image: images.fencing,
    alt: 'Secure dark metal perimeter fence outside a building',
    benefits: ['Boundary assessment', 'Clear scope before installation', 'Integration with wider security planning'],
  },
  {
    slug: 'annual-maintenance',
    title: 'Annual Maintenance Service',
    eyebrow: 'Ongoing support',
    short: 'Regular technical attention for the systems your property depends on every day.',
    description:
      'Maintenance arrangements help keep installed systems under review. Raynoid discusses the equipment, service needs and suitable maintenance scope for each property.',
    image: images.maintenance,
    alt: 'Electrical technician carrying out maintenance work',
    benefits: ['Planned system checks', 'Service scope matched to equipment', 'Documented follow-up needs'],
  },
];

export const process = [
  'Tell us what you need.',
  'Discuss the project requirements.',
  'Confirm the proposed solution and scope.',
  'Arrange installation or service.',
  'Discuss maintenance and support arrangements.',
];

export const adminSections = [
  'Overview',
  'Projects',
  'Services',
  'Media Library',
  'Homepage Content',
  'Company Settings',
  'Enquiries',
  'SEO and Social Links',
  'Account and Security',
];
