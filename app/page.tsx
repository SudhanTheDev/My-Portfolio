import dynamic from 'next/dynamic';
import type { CSSProperties, ReactNode } from 'react';
import { HeroSection } from '@/components/sections/hero-section';

const ServicesSection = dynamic(
  () => import('@/components/sections/services-section').then((m) => m.ServicesSection),
  { loading: () => <SectionSkeleton /> }
);
const ProjectsSection = dynamic(
  () => import('@/components/sections/projects-section').then((m) => m.ProjectsSection),
  { loading: () => <SectionSkeleton /> }
);
const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then((m) => m.AboutSection),
  { loading: () => <SectionSkeleton /> }
);
const ExperienceSection = dynamic(
  () => import('@/components/sections/experience-section').then((m) => m.ExperienceSection),
  { loading: () => <SectionSkeleton /> }
);
const SkillsSection = dynamic(
  () => import('@/components/sections/skills-section').then((m) => m.SkillsSection),
  { loading: () => <SectionSkeleton /> }
);
const StatsSection = dynamic(
  () => import('@/components/sections/stats-secttion').then((m) => m.StatsSection),
  { loading: () => <SectionSkeleton /> }
);
const GallerySection = dynamic(
  () => import('@/components/sections/gallery-section').then((m) => m.GallerySection),
  { loading: () => <SectionSkeleton /> }
);
const GamingSection = dynamic(
  () => import('@/components/sections/gaming-section').then((m) => m.GamingSection),
  { loading: () => <SectionSkeleton /> }
);
const PersonalitySection = dynamic(
  () => import('@/components/sections/personality-section').then((m) => m.PersonalitySection),
  { loading: () => <SectionSkeleton /> }
);
const ContactSection = dynamic(
  () => import('@/components/sections/contact-section').then((m) => m.ContactSection),
  { loading: () => <SectionSkeleton /> }
);
const Footer = dynamic(
  () => import('@/components/sections/footer').then((m) => m.Footer),
  { loading: () => <SectionSkeleton /> }
);

function SectionSkeleton() {
  return <div className="h-32 border-t border-border" aria-hidden />;
}

const deferredSectionStyle = {
  contentVisibility: 'auto',
  containIntrinsicSize: '900px',
} as CSSProperties;

function DeferredSection({ children }: { children: ReactNode }) {
  return <div style={deferredSectionStyle}>{children}</div>;
}

export default function Home() {
  return (
    <main className="relative">
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        hidden
        aria-hidden="true"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input name="bot-field" />
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message" />
      </form>

      <HeroSection />
      <DeferredSection>
        <ServicesSection />
      </DeferredSection>
      <DeferredSection>
        <ProjectsSection />
      </DeferredSection>
      <DeferredSection>
        <AboutSection />
      </DeferredSection>
      <DeferredSection>
        <ExperienceSection />
      </DeferredSection>
      <DeferredSection>
        <SkillsSection />
      </DeferredSection>
      <DeferredSection>
        <StatsSection />
      </DeferredSection>
      <DeferredSection>
        <GallerySection />
      </DeferredSection>
      <DeferredSection>
        <GamingSection />
      </DeferredSection>
      <DeferredSection>
        <PersonalitySection />
      </DeferredSection>
      <DeferredSection>
        <ContactSection />
      </DeferredSection>
      <DeferredSection>
        <Footer />
      </DeferredSection>
    </main>
  );
}
