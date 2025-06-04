import type { MetaFunction } from "@remix-run/node";
import { Card, Input } from "antd";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-6">
      <div className="mx-auto w-[50%]">
        <Input placeholder="Search" className="mb-6" />
        <Card title="Test A">
          This is a test
        </Card>
      </div>
    </div>
  );
}
