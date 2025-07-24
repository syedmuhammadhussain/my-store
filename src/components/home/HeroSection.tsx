"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";
import TypewriterHeading from "../TypewriterHeading";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-wrap align-center justify-between py-6 px-8 pt-10 pb-16">
        <div className="w-[100%] md:w-180 space-y-6">
          <h1 className="text-3xl md:text-6xl leading-tight font-bold md:font-normal">
            Online care that comes to you —{" "}
            <TypewriterHeading
              words={["weight loss", "sexual health", "hair loss", "skincare"]}
            />
          </h1>
          <div className="flex flex-wrap align-center justify-between space-x-4">
            <p className="w-[100%] md:w-100 text-md mb-10 md:mb-0">
              Licensed U.S. providers. No insurance needed. Get virtual
              consultations, personalized treatments, and prescriptions — all
              from home.
            </p>
            <div className="space-x-4 mr-0 md:mr-10 mb-20 md:mb-0">
              <Button size="lg" variant="blue3d">
                Start Now
              </Button>
              <Button variant="white3d" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[100%] md:w-80">
          <Card className="bg-white text-black shadow-none border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Trusted by Our Users
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Flexible Refund Policies",
                "Free & Discreet Shipping",
                "Licensed & Top Rated Doctors",
                "24/7 Customer Support",
              ].map((text) => (
                <div key={text} className="flex items-center space-x-3">
                  <Box className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Optional: Background slider images */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-3 gap-4 p-8">
          <img src="/images/slide1.jpg" className="rounded-2xl object-cover" />
          <img src="/images/slide2.jpg" className="rounded-2xl object-cover" />
          <img src="/images/slide3.jpg" className="rounded-2xl object-cover" />
        </div>
      </div> */}
    </section>
  );
}
