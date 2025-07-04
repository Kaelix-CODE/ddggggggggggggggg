import { VideoSection } from "@/components/video-section";
import { VerificationFormComponent } from "@/components/verification-form";

export function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 min-h-screen">
          <VideoSection />
          <div className="lg:flex lg:items-center lg:justify-center p-4 lg:p-8">
            <div className="max-w-md mx-auto lg:max-w-lg w-full">
              <VerificationFormComponent />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
