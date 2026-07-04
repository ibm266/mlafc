import { site } from '@/data/site';

const BASE = 'https://www.mumbailondonaf.com';

const data = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Physician',
      '@id': `${BASE}#physician`,
      name: 'Professor Dhiraj Gupta',
      medicalSpecialty: 'Cardiovascular',
      description:
        'Consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital; sees patients at the Mumbai London AF Clinic.',
      url: BASE,
      worksFor: { '@id': `${BASE}#clinic` },
    },
    {
      '@type': 'MedicalClinic',
      '@id': `${BASE}#clinic`,
      name: site.name,
      url: BASE,
      email: site.email,
      telephone: site.phone,
      address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
      medicalSpecialty: 'Cardiovascular',
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
