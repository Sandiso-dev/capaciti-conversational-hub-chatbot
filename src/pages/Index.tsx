
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
      <Navigation />
      <Hero />
      <ChatWidget />
    </main>
  );
};

export default Index;
