"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import SizeChart from "@/components/products/SizeChart";

export default function SizeChartTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-xs mb-8 p-0 bg-white border-0 hover:bg-white hover:underline shadow-none"
        >
          <span className="uppercase">Size Chart</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <SizeChart />
      </DialogContent>
    </Dialog>
  );
}
