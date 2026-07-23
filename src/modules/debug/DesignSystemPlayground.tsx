import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Typography } from '../../components/ui/Typography';
import { 
  Plus, Search, Mail, Settings, Bell, 
  ChevronRight, Heart, Star, Sparkles 
} from 'lucide-react';

export const DesignSystemPlayground: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 pb-32">
      <div className="space-y-4 border-b border-border-base pb-8">
        <Typography variant="display">Design System Playground</Typography>
        <Typography variant="subtitle">Unified UI Foundation for LoveNote 4.0</Typography>
      </div>

      {/* Typography Section */}
      <section className="space-y-6">
        <Typography variant="title" className="border-l-4 border-primary pl-4">Typography Scale</Typography>
        <div className="grid gap-6 bg-surface p-8 rounded-lg border border-border-subtle">
          <Typography variant="display">Display Text (Desktop 60px)</Typography>
          <Typography variant="h1">Heading 1 (Desktop 36px)</Typography>
          <Typography variant="h2">Heading 2 (Desktop 30px)</Typography>
          <Typography variant="h3">Heading 3 (Desktop 24px)</Typography>
          <Typography variant="title">Title Text (20px)</Typography>
          <Typography variant="subtitle">Subtitle Text (18px)</Typography>
          <Typography variant="body">Body Text (16px) - The quick brown fox jumps over the lazy dog.</Typography>
          <Typography variant="body-sm">Body Small (14px) - Used for dense UI and descriptions.</Typography>
          <Typography variant="caption">Caption Text (12px) - Used for metadata and timestamps.</Typography>
          <Typography variant="label">Label Text (10px) - Uppercase tracking for headers.</Typography>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <Typography variant="title" className="border-l-4 border-primary pl-4">Button System</Typography>
        <div className="space-y-8 bg-surface p-8 rounded-lg border border-border-subtle">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Action</Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Default</Button>
            <Button size="lg">Large Hero</Button>
            <Button size="xl">Extra Large</Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Plus size={16} />}>Add New</Button>
            <Button rightIcon={<ChevronRight size={16} />} variant="secondary">Continue</Button>
            <Button isLoading>Processing</Button>
            <Button disabled>Disabled State</Button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <Typography variant="title" className="border-l-4 border-primary pl-4">Card System</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="default">
            <Typography variant="title" className="mb-2">Default Card</Typography>
            <Typography variant="body-sm" className="text-text-muted">Standard card with level 1 shadow and border.</Typography>
          </Card>
          <Card variant="elevated">
            <Typography variant="title" className="mb-2">Elevated Card</Typography>
            <Typography variant="body-sm" className="text-text-muted">Higher elevation shadow for emphasis.</Typography>
          </Card>
          <Card variant="outlined">
            <Typography variant="title" className="mb-2">Outlined Card</Typography>
            <Typography variant="body-sm" className="text-text-muted">Thick border, no shadow. Good for secondary info.</Typography>
          </Card>
          <Card variant="flat">
            <Typography variant="title" className="mb-2">Flat Card</Typography>
            <Typography variant="body-sm" className="text-text-muted">Background color based, no border or shadow.</Typography>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card isHoverable className="h-48 flex flex-col justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <Heart size={24} />
            </div>
            <Typography variant="title">Hoverable Action</Typography>
          </Card>
          <Card isHoverable className="h-48 flex flex-col justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Star size={24} />
            </div>
            <Typography variant="title">Interactive Card</Typography>
          </Card>
          <Card isHoverable className="h-48 flex flex-col justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles size={24} />
            </div>
            <Typography variant="title">Smart Feature</Typography>
          </Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-6">
        <Typography variant="title" className="border-l-4 border-primary pl-4">Form Controls</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-8 rounded-lg border border-border-subtle">
          <Input label="Project Name" placeholder="e.g. My Anniversary Trip" />
          <Input label="Search Projects" placeholder="Search..." leftIcon={<Search size={18} />} />
          <Input label="Email Address" defaultValue="user@example.com" rightIcon={<Mail size={18} />} />
          <Input label="Password" type="password" error="Password must be at least 8 characters long" />
          <Input label="Disabled Input" disabled value="System Managed Content" />
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-6">
        <Typography variant="title" className="border-l-4 border-primary pl-4">Color Tokens</Typography>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <ColorSwatch name="Primary" className="bg-primary text-white" />
          <ColorSwatch name="Primary Hover" className="bg-primary-hover text-white" />
          <ColorSwatch name="Surface" className="bg-surface border border-border-base text-text-main" />
          <ColorSwatch name="Surface Elevated" className="bg-surface-elevated text-text-main" />
          <ColorSwatch name="Border Subtle" className="bg-border-subtle text-text-muted" />
          <ColorSwatch name="Border Base" className="bg-border-base text-text-muted" />
          <ColorSwatch name="Text Main" className="bg-text-main text-white" />
          <ColorSwatch name="Text Muted" className="bg-text-muted text-white" />
        </div>
      </section>
    </div>
  );
};

const ColorSwatch: React.FC<{ name: string; className: string }> = ({ name, className }) => (
  <div className="space-y-2">
    <div className={`h-20 w-full rounded-md flex items-end p-2 text-[10px] font-bold uppercase ${className}`}>
      {name}
    </div>
    <Typography variant="label">{name}</Typography>
  </div>
);
