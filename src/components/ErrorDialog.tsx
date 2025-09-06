import { AlertTriangle } from "lucide-react";

export default function ErrorDialog() {
  return (
    <div className="error-dialog">
      <div className="error-header">
        <AlertTriangle size={24} className="icon" />
        <h2>Extension error</h2>
      </div>
    </div>
  );
}
