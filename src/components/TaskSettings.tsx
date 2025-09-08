import { Separator } from "@/components/ui/separator";

export default function TaskSettings() {
  return (
    <div className="overflow-hidden rounded-[0.5rem] border shadow-md">
      <div className="h-full">
        <div className="container flex items-center justify-between py-4">
          <h2 className="text-lg font-semibold">Task settings</h2>
          <div className="flex items-center space-x-2">
            <h3>Start</h3>
            <h3>Stop</h3>
          </div>
        </div>
        <Separator />
        <div className="container h-full py-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
          excepturi culpa beatae, impedit temporibus sint ut doloremque sunt
          molestiae voluptatum nostrum cupiditate iste nulla harum, ab doloribus
          dignissimos accusantium! Dignissimos?
        </div>
      </div>
    </div>
  );
}
