import { Hero } from "@/components/sections/hero";
import { AnimatedStats } from "@/components/sections/animated-counter";
import {
  AboutEnterpriseDev,
  AboutIntro,
  AboutRecognition,
  AboutValues
} from "@/components/sections/about-sections";
import { ProductSuite } from "@/components/sections/product-suite";
import { CoreEntitiesHighlight } from "@/components/sections/core-entities";
import { GlobalClientPortfolio } from "@/components/sections/global-client-portfolio";
import { TrustedImageScroller } from "@/components/sections/trusted-image-scroller";
import { ContactCta } from "@/components/shared/contact-cta";
import { DemoLabs } from "@/components/sections/demo-labs";
import { AIAgentChat } from "@/components/sections/ai-agent-chat";
import { WorldClientMap } from "@/components/sections/world-map";
import { AdminAnalytics } from "@/components/sections/admin-analytics";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutIntro compact />
      <AboutRecognition />
      <AboutValues />
      <AnimatedStats />
      <div id="products">
        <CoreEntitiesHighlight />
        <ProductSuite />
      </div>
      <div id="clients">
        <GlobalClientPortfolio />
      </div>
      <AboutEnterpriseDev />
      <ContactCta />
      <TrustedImageScroller />
      <DemoLabs />
      <AIAgentChat />
      <WorldClientMap />
      <AdminAnalytics />
    </main>
  );
}
