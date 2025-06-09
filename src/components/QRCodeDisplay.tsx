
import { Card } from "@/components/ui/card";
import { QrCode } from "lucide-react";

interface QRCodeDisplayProps {
  deviceId: string;
}

const QRCodeDisplay = ({ deviceId }: QRCodeDisplayProps) => {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`HYMNAL:${deviceId}`)}`;

  return (
    <Card className="p-6 mb-8 bg-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Remote Control Access</h3>
          <p className="text-slate-600 mb-2">
            Scan this QR code with your phone to connect as a remote control
          </p>
          <p className="text-sm text-slate-500">
            Device ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{deviceId}</span>
          </p>
        </div>
        <div className="text-center">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for remote control" 
            className="w-32 h-32 border border-slate-200 rounded-lg"
          />
          <p className="text-xs text-slate-500 mt-2">Scan to connect</p>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeDisplay;
