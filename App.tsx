import React, { useState, useEffect } from "react";
import { Profile, Category, Factor } from "./types";
import { DecisionWorkspace } from "./components/DecisionWorkspace";
import { ProfileSelector } from "./components/ProfileSelector";

// Migration helper for old single-mode data
const migrateLegacyData = (): Profile | null => {
  try {
    const legacy = localStorage.getItem("decision-scale-data");
    if (legacy) {
      const categories = JSON.parse(legacy);
      if (Array.isArray(categories)) {
        localStorage.removeItem("decision-scale-data"); // Clean up
        return {
          id: "legacy-migrated",
          name: "My Previous Decision",
          categories,
          lastModified: Date.now(),
        };
      }
    }
  } catch (e) {
    console.error("Migration failed", e);
  }
  return null;
};

const createTemplate = (type: string): Profile => {
  const id = crypto.randomUUID();
  const timestamp = Date.now();

  let name = "Untitled Decision";
  let categories: Category[] = [];

  const commonProps = { id, lastModified: timestamp, starred: false };

  switch (type) {
    case "job":
      name = "Job Search";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "Tech Corp",
          pros: [
            { id: "p1", description: "High Salary", weight: 9 },
            { id: "p2", description: "Brand Name", weight: 6 },
          ],
          cons: [
            { id: "c1", description: "Long Commute", weight: 7 },
            { id: "c2", description: "Legacy Tech", weight: 4 },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: "Startup Inc",
          pros: [
            { id: "p3", description: "Remote Work", weight: 10 },
            { id: "p4", description: "Modern Stack", weight: 8 },
          ],
          cons: [
            { id: "c3", description: "Risk of failure", weight: 6 },
            { id: "c4", description: "Lower Salary", weight: 5 },
          ],
        },
      ];
      break;
    case "food":
      name = "Lunch Options";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "Salad Bar",
          pros: [{ id: "p1", description: "Healthy", weight: 10 }],
          cons: [
            { id: "c1", description: "Expensive", weight: 6 },
            { id: "c2", description: "Not Filling", weight: 4 },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: "Pizza Place",
          pros: [
            { id: "p2", description: "Delicious", weight: 9 },
            { id: "p3", description: "Cheap", weight: 8 },
          ],
          cons: [
            { id: "c3", description: "Unhealthy", weight: 9 },
            { id: "c4", description: "Food Coma", weight: 5 },
          ],
        },
      ];
      break;
    case "life":
      name = "Moving Cities";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "New York",
          pros: [
            { id: "p1", description: "Excitement", weight: 9 },
            { id: "p2", description: "Career", weight: 10 },
          ],
          cons: [
            { id: "c1", description: "Cost of Living", weight: 10 },
            { id: "c2", description: "Noise", weight: 5 },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: "Austin",
          pros: [
            { id: "p3", description: "Music Scene", weight: 7 },
            { id: "p4", description: "Weather", weight: 6 },
          ],
          cons: [{ id: "c3", description: "Traffic", weight: 6 }],
        },
      ];
      break;
    case "house":
      name = "Home Buying";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "City Condo",
          pros: [
            { id: "p1", description: "Walkable", weight: 9 },
            { id: "p2", description: "Low Maintenance", weight: 8 },
          ],
          cons: [
            { id: "c1", description: "Small Space", weight: 7 },
            { id: "c2", description: "HOA Fees", weight: 6 },
          ],
        },
        {
          id: crypto.randomUUID(),
          name: "Suburban House",
          pros: [
            { id: "p3", description: "Big Yard", weight: 8 },
            { id: "p4", description: "Quiet", weight: 7 },
          ],
          cons: [
            { id: "c3", description: "Commute", weight: 9 },
            { id: "c4", description: "Maintenance", weight: 6 },
          ],
        },
      ];
      break;
    case "education":
      name = "University Choice";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "State University",
          pros: [
            { id: "p1", description: "Affordable", weight: 10 },
            { id: "p2", description: "Friends", weight: 7 },
          ],
          cons: [{ id: "c1", description: "Large Classes", weight: 5 }],
        },
        {
          id: crypto.randomUUID(),
          name: "Private College",
          pros: [
            { id: "p3", description: "Prestige", weight: 8 },
            { id: "p4", description: "Small Classes", weight: 8 },
          ],
          cons: [{ id: "c3", description: "Expensive", weight: 10 }],
        },
      ];
      break;
    case "tech":
      name = "Gadget Purchase";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "Flagship Model",
          pros: [
            { id: "p1", description: "Best Camera", weight: 9 },
            { id: "p2", description: "Performance", weight: 9 },
          ],
          cons: [{ id: "c1", description: "Very Expensive", weight: 9 }],
        },
        {
          id: crypto.randomUUID(),
          name: "Budget Model",
          pros: [
            { id: "p3", description: "Great Value", weight: 10 },
            { id: "p4", description: "Good Battery", weight: 8 },
          ],
          cons: [{ id: "c3", description: "Average Camera", weight: 6 }],
        },
      ];
      break;
    default:
      name = "New Decision";
      categories = [
        {
          id: crypto.randomUUID(),
          name: "Option A",
          pros: [],
          cons: [],
        },
      ];
  }

  return { ...commonProps, name, categories };
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const App: React.FC = () => {
  // Global Profiles State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Load profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles`);
        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        }
      } catch (e) {
        console.error("Failed to fetch profiles", e);
        // Fallback to localStorage if API fails (optional, but good for transition)
        const saved = localStorage.getItem("decision-scale-profiles");
        if (saved) setProfiles(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Handlers
  const handleCreateProfile = async (template: string) => {
    const newProfile = createTemplate(template);

    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });
      if (response.ok) {
        const saved = await response.json();
        setProfiles((prev) => [...prev, saved]);
        setActiveProfileId(saved.id);
      }
    } catch (e) {
      console.error("Failed to save new profile", e);
      // Fallback
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this decision?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProfiles((prev) => prev.filter((p) => p.id !== id));
          if (activeProfileId === id) setActiveProfileId(null);
        }
      } catch (e) {
        console.error("Failed to delete profile", e);
      }
    }
  };

  const handleUpdateProfile = async (updated: Profile) => {
    // Update local state immediately for responsiveness
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    try {
      await fetch(`${API_BASE_URL}/profiles/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  const handleToggleStar = async (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;

    const updated = { ...profile, starred: !profile.starred };
    handleUpdateProfile(updated);
  };

  // Render Logic
  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (activeProfileId && activeProfile) {
    return (
      <DecisionWorkspace
        profile={activeProfile}
        onUpdate={handleUpdateProfile}
        onDelete={() => handleDeleteProfile(activeProfile.id)}
        onToggleStar={() => handleToggleStar(activeProfile.id)}
        onBack={() => setActiveProfileId(null)}
      />
    );
  }

  return (
    <ProfileSelector
      profiles={profiles}
      onSelect={setActiveProfileId}
      onCreate={handleCreateProfile}
      onDelete={handleDeleteProfile}
      onToggleStar={handleToggleStar}
    />
  );
};

export default App;
