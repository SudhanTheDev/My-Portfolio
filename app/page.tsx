import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { GamingSection } from "@/components/sections/gaming-section";
import { PersonalitySection } from "@/components/sections/personality-section";
import { StatsSection } from "@/components/sections/stats-secttion";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <ExperienceSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Gaming Section */}
      <GamingSection />

      {/* Personality Section */}
      <PersonalitySection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
