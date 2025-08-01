import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16"> {/* Add padding for fixed header */}
        <Hero />
        <Features />
      </div>
    </div>
  );
};

export default Index;
