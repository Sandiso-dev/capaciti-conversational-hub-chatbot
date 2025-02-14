
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button variant="outline" className="space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 glass">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">1,234</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
                <h3 className="text-2xl font-bold">5,678</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <h3 className="text-2xl font-bold">98.5%</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity & Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 glass">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-3 glass rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">User asked about course requirements</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 glass">
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <input
                  type="text"
                  value="CAPACITI"
                  className="w-full mt-1 p-2 rounded-md bg-secondary border border-border"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Website</label>
                <input
                  type="text"
                  value="https://uvuafrica.com/capaciti/"
                  className="w-full mt-1 p-2 rounded-md bg-secondary border border-border"
                  readOnly
                />
              </div>
              <Button className="w-full">Update Information</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
