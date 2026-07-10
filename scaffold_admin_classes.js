const fs = require('fs');
const path = require('path');

const adminPagesDir = path.join(__dirname, 'fitempire-admin', 'src', 'pages');
const classSchedulerContent = `import React from 'react';

export default function ClassSchedulerPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Scheduler</h1>
          <p className="text-gray-500 mt-2">Manage your trainers and fitness classes</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + Schedule New Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Calendar/Schedule View */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
            <div className="flex space-x-2">
              <span className="text-sm text-gray-500">July 09, 2026</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Dummy Schedule Items */}
            {[
              { time: '07:00 AM', name: 'Power Yoga', trainer: 'Anjali Desai', slots: '24/30 booked' },
              { time: '05:00 PM', name: 'Zumba Masterclass', trainer: 'Rahul Sharma', slots: '30/30 (Full)' },
              { time: '06:30 PM', name: 'HIIT Explosion', trainer: 'Vikram Singh', slots: '12/20 booked' },
            ].map((cls, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-6">
                  <div className="w-24 text-right">
                    <span className="text-sm font-bold text-gray-900">{cls.time}</span>
                  </div>
                  <div className="h-10 w-1 bg-primary/20 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {cls.trainer}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 mb-1">
                    {cls.slots}
                  </span>
                  <div className="text-sm text-primary cursor-pointer hover:underline">Manage Roster</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Trainers List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Active Trainers</h2>
            <button className="text-sm text-primary hover:underline font-medium">+ Add</button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Dummy Trainers */}
            {[
              { name: 'Rahul Sharma', spec: 'Cardio, Zumba' },
              { name: 'Anjali Desai', spec: 'Yoga, Pilates' },
              { name: 'Vikram Singh', spec: 'Strength, HIIT' },
            ].map((trainer, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {trainer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{trainer.name}</h4>
                  <p className="text-xs text-gray-500">{trainer.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(adminPagesDir, 'ClassSchedulerPage.tsx'), classSchedulerContent);
console.log("Created ClassSchedulerPage.tsx");

// Update DashboardLayout.tsx
const layoutPath = path.join(__dirname, 'fitempire-admin', 'src', 'layouts', 'DashboardLayout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (!layoutContent.includes('to="/dashboard/classes"')) {
    layoutContent = layoutContent.replace(
        '<NavLink to="/dashboard/users" className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-xl transition-colors ${isActive ? \'bg-primary/10 text-primary font-semibold\' : \'text-gray-600 hover:bg-gray-50\'}`}>\n              <Users className="w-5 h-5" />\n              <span>Users</span>\n            </NavLink>',
        `<NavLink to="/dashboard/users" className={({ isActive }) => \`flex items-center space-x-3 p-3 rounded-xl transition-colors \${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}\`}>\n              <Users className="w-5 h-5" />\n              <span>Users</span>\n            </NavLink>\n            <NavLink to="/dashboard/classes" className={({ isActive }) => \`flex items-center space-x-3 p-3 rounded-xl transition-colors \${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'}\`}>\n              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>\n              <span>Classes</span>\n            </NavLink>`
    );
    
    fs.writeFileSync(layoutPath, layoutContent);
    console.log("Updated DashboardLayout.tsx with Classes route");
}

// Update App.tsx
const appPath = path.join(__dirname, 'fitempire-admin', 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('ClassSchedulerPage')) {
    appContent = appContent.replace(
        'import SettingsPage from \'./pages/SettingsPage\';',
        'import SettingsPage from \'./pages/SettingsPage\';\nimport ClassSchedulerPage from \'./pages/ClassSchedulerPage\';'
    );
    
    appContent = appContent.replace(
        '<Route path="users" element={<UsersPage />} />',
        '<Route path="users" element={<UsersPage />} />\n            <Route path="classes" element={<ClassSchedulerPage />} />'
    );
    
    fs.writeFileSync(appPath, appContent);
    console.log("Updated App.tsx with Classes route");
}
