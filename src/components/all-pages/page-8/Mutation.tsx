'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, UsersRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { defaultDataPage8, IPage8Data, TeamMember, TeamRow } from './data';

export interface Page8FormProps {
  data?: IPage8Data;
  onSubmit: (values: IPage8Data) => void;
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyMember = (): TeamMember => ({
  id: createId('member'),
  name: 'New Team Member',
  title: 'Role / Position',
  bio: 'Write a short introduction for this team member.',
  image: '',
});

const createEmptyRow = (): TeamRow => ({
  id: createId('row'),
  label: 'New Team Group',
  members: [createEmptyMember()],
});

const cloneData = (data: IPage8Data): IPage8Data => ({
  ...data,
  ceo: { ...data.ceo },
  rows: data.rows.map(row => ({ ...row, members: row.members.map(member => ({ ...member })) })),
});

const normalizeData = (data?: IPage8Data): IPage8Data => {
  if (!data?.ceo || !Array.isArray(data.rows)) return cloneData(defaultDataPage8);
  return cloneData({
    ...defaultDataPage8,
    ...data,
    ceo: { ...defaultDataPage8.ceo, ...data.ceo },
    rows: data.rows.map((row, rowIndex) => ({
      id: row.id || `row-${rowIndex + 1}`,
      label: row.label || `Team Group ${rowIndex + 1}`,
      members: Array.isArray(row.members)
        ? row.members.map((member, memberIndex) => ({
            ...member,
            id: member.id || `member-${rowIndex + 1}-${memberIndex + 1}`,
          }))
        : [],
    })),
  });
};

const MutationPage8 = ({ data, onSubmit }: Page8FormProps) => {
  const [formData, setFormData] = useState<IPage8Data>(() => normalizeData(data));

  useEffect(() => {
    setFormData(normalizeData(data));
  }, [data]);

  const updateField = (field: 'pageName' | 'eyebrow' | 'title' | 'description' | 'founderLabel', value: string) => {
    setFormData(current => ({ ...current, [field]: value }));
  };

  const updateCeo = (field: keyof TeamMember, value: string) => {
    setFormData(current => ({ ...current, ceo: { ...current.ceo, [field]: value } }));
  };

  const updateRowLabel = (rowIndex: number, value: string) => {
    setFormData(current => ({
      ...current,
      rows: current.rows.map((row, index) => (index === rowIndex ? { ...row, label: value } : row)),
    }));
  };

  const updateMember = (rowIndex: number, memberIndex: number, field: keyof TeamMember, value: string) => {
    setFormData(current => ({
      ...current,
      rows: current.rows.map((row, index) =>
        index === rowIndex
          ? { ...row, members: row.members.map((member, position) => (position === memberIndex ? { ...member, [field]: value } : member)) }
          : row,
      ),
    }));
  };

  const addRow = () => setFormData(current => ({ ...current, rows: [...current.rows, createEmptyRow()] }));

  const removeRow = (rowIndex: number) => {
    setFormData(current => ({ ...current, rows: current.rows.filter((_, index) => index !== rowIndex) }));
  };

  const addMember = (rowIndex: number) => {
    setFormData(current => ({
      ...current,
      rows: current.rows.map((row, index) => (index === rowIndex ? { ...row, members: [...row.members, createEmptyMember()] } : row)),
    }));
  };

  const removeMember = (rowIndex: number, memberIndex: number) => {
    setFormData(current => ({
      ...current,
      rows: current.rows.map((row, index) =>
        index === rowIndex ? { ...row, members: row.members.filter((_, position) => position !== memberIndex) } : row,
      ),
    }));
  };

  const memberFields = (
    member: TeamMember,
    onChange: (field: keyof TeamMember, value: string) => void,
  ) => (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={member.name} onChange={event => onChange('name', event.target.value)} className="border-zinc-800 bg-zinc-900" />
        </div>
        <div className="space-y-2">
          <Label>Role / Title</Label>
          <Input value={member.title} onChange={event => onChange('title', event.target.value)} className="border-zinc-800 bg-zinc-900" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input value={member.image} onChange={event => onChange('image', event.target.value)} className="border-zinc-800 bg-zinc-900" />
      </div>
      <div className="space-y-2">
        <Label>Biography</Label>
        <Textarea
          value={member.bio}
          onChange={event => onChange('bio', event.target.value)}
          className="min-h-24 resize-none border-zinc-800 bg-zinc-900"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-zinc-100 md:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 p-6">
          <div className="rounded-lg bg-fuchsia-500/10 p-2">
            <UsersRound className="text-fuchsia-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Team Page</h2>
            <p className="text-sm text-zinc-400">Edit the page introduction, founder profile, team groups, and every team member.</p>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Page Header</h3>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Page Name</Label>
                  <Input value={formData.pageName} onChange={event => updateField('pageName', event.target.value)} className="border-zinc-800 bg-zinc-900" />
                </div>
                <div className="space-y-2">
                  <Label>Eyebrow</Label>
                  <Input value={formData.eyebrow} onChange={event => updateField('eyebrow', event.target.value)} className="border-zinc-800 bg-zinc-900" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={event => updateField('title', event.target.value)} className="border-zinc-800 bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={event => updateField('description', event.target.value)}
                  className="min-h-28 resize-none border-zinc-800 bg-zinc-900"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-fuchsia-300">Founder Profile</h3>
              <Input
                aria-label="Founder badge label"
                value={formData.founderLabel}
                onChange={event => updateField('founderLabel', event.target.value)}
                className="h-9 max-w-32 border-zinc-800 bg-zinc-900"
              />
            </div>
            {memberFields(formData.ceo, updateCeo)}
          </section>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Team Groups</h3>
              <p className="mt-1 text-xs text-zinc-500">Each group becomes one labeled row in the public team layout.</p>
            </div>
            <Button type="button" onClick={addRow} variant="outlineGlassy" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Group
            </Button>
          </div>

          {formData.rows.map((row, rowIndex) => (
            <section key={row.id} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label>Group Label</Label>
                  <Input value={row.label} onChange={event => updateRowLabel(rowIndex, event.target.value)} className="border-zinc-800 bg-zinc-900" />
                </div>
                <Button type="button" onClick={() => removeRow(rowIndex)} variant="outlineFire" size="sm" className="mt-6 h-9 w-9 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {row.members.map((member, memberIndex) => (
                  <div key={member.id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-300">Member {memberIndex + 1}</p>
                      <Button
                        type="button"
                        onClick={() => removeMember(rowIndex, memberIndex)}
                        variant="outlineFire"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {memberFields(member, (field, value) => updateMember(rowIndex, memberIndex, field, value))}
                  </div>
                ))}
              </div>

              <Button type="button" onClick={() => addMember(rowIndex)} variant="outlineGlassy" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </section>
          ))}
        </div>

        <div className="flex justify-end border-t border-zinc-800 bg-zinc-900/80 p-6">
          <Button type="button" onClick={() => onSubmit(formData)} variant="outlineGlassy" size="sm">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MutationPage8;
