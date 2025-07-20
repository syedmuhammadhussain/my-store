"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Text + CTAs */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Online care that comes to you —{" "}
            <span className="text-blue-500">weight loss</span>
          </h1>
          <p className="text-lg text-gray-300">
            Licensed U.S. providers. No insurance needed. Get virtual
            consultations, personalized treatments, and prescriptions — all from
            home.
          </p>
          <div className="flex space-x-4">
            <Button size="lg" variant="blue3d">
              Start Now
            </Button>
            <Button variant="white3d" size="lg">
              Contact Us
            </Button>
          </div>
        </div>

        {/* Right: “Trusted by Our Users” card */}
        <Card className="bg-white text-black shadow-lg rounded-2xl">
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
