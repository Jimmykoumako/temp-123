
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Copy, FileText, List, Edit3 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface VisualEditorProps {
  lyricsData: LyricsData;
  hymnNumber: string;
  onLyricsChange: (data: LyricsData) => void;
  onHymnNumberChange: (number: string) => void;
}

interface SortableSectionProps {
  sectionId: string;
  sectionData: LyricsLine[];
  sectionType: 'verse' | 'chorus';
  sectionIndex: number;
  sectionTitle: string;
  selectedSection: string | null;
  onSectionClick: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onAddLine: (sectionType: 'verse' | 'chorus', sectionIndex: number) => void;
  onUpdateLine: (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number, text: string) => void;
  onDeleteLine: (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number) => void;
}

const SortableSection = ({
  sectionId,
  sectionData,
  sectionType,
  sectionIndex,
  sectionTitle,
  selectedSection,
  onSectionClick,
  onDeleteSection,
  onDuplicateSection,
  onAddLine,
  onUpdateLine,
  onDeleteLine,
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-4 ${selectedSection === sectionId ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSectionClick(sectionId)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div {...attributes} {...listeners}>
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
            </div>
            {sectionTitle}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateSection(sectionId);
              }}
              variant="ghost"
              size="sm"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSection(sectionId);
              }}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sectionData.map((line, lineIndex) => (
            <div key={lineIndex} className="space-y-2">
              <div className="flex items-center gap-2">
                <Textarea
                  value={line.text}
                  onChange={(e) => onUpdateLine(sectionType, sectionIndex, lineIndex, e.target.value)}
                  placeholder="Enter lyrics line..."
                  className="min-h-[40px] resize-none"
                  rows={1}
                />
                <Button
                  onClick={() => onDeleteLine(sectionType, sectionIndex, lineIndex)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {line.syllables.length > 0 && (
                <div className="text-xs text-gray-500 ml-2">
                  Syllables: {line.syllables.join(' • ')}
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={() => onAddLine(sectionType, sectionIndex)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Line
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickOrderView = ({ lyricsData, onOrderChange }: { lyricsData: LyricsData; onOrderChange: (newOrder: string[]) => void }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = lyricsData.order.indexOf(active.id as string);
      const newIndex = lyricsData.order.indexOf(over.id as string);
      const newOrder = arrayMove(lyricsData.order, oldIndex, newIndex);
      onOrderChange(newOrder);
    }
  };

  const getSectionTitle = (sectionId: string) => {
    if (sectionId.startsWith('verse')) {
      const index = parseInt(sectionId.replace('verse', ''));
      return `Verse ${index}`;
    } else if (sectionId.startsWith('chorus')) {
      const index = parseInt(sectionId.replace('chorus', ''));
      return `Chorus ${index}`;
    }
    return sectionId;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Drag and drop to reorder sections
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={lyricsData.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {lyricsData.order.map((sectionId, index) => {
              const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sectionId });
              
              const style = {
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
              };

              return (
                <div
                  key={sectionId}
                  ref={setNodeRef}
                  style={style}
                  className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{getSectionTitle(sectionId)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Position: {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const JsonView = ({ lyricsData }: { lyricsData: LyricsData }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        JSON representation of the lyrics data
      </div>
      <Textarea
        value={JSON.stringify(lyricsData, null, 2)}
        readOnly
        className="min-h-[400px] font-mono text-sm"
        placeholder="Lyrics JSON will appear here..."
      />
    </div>
  );
};

const VisualEditor = ({ lyricsData, hymnNumber, onLyricsChange, onHymnNumberChange }: VisualEditorProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedHymn, setSelectedHymn] = useState<string>("");
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sample hymn options - in a real app, this would come from a database
  const hymnOptions = [
    { value: "001", label: "Amazing Grace" },
    { value: "015", label: "How Great Thou Art" },
    { value: "023", label: "Holy, Holy, Holy" },
    { value: "032", label: "Be Thou My Vision" },
    { value: "045", label: "It Is Well With My Soul" },
    { value: "067", label: "Blessed Assurance" },
  ];

  const addVerse = () => {
    const newVerseIndex = lyricsData.verses.length;
    const newVerses = [...lyricsData.verses, [{ text: "", syllables: [] }]];
    const newOrder = [...lyricsData.order, `verse${newVerseIndex + 1}`];
    
    onLyricsChange({
      ...lyricsData,
      verses: newVerses,
      order: newOrder
    });
  };

  const addChorus = () => {
    const newChorusIndex = lyricsData.choruses.length;
    const newChoruses = [...lyricsData.choruses, [{ text: "", syllables: [] }]];
    const newOrder = [...lyricsData.order, `chorus${newChorusIndex + 1}`];
    
    onLyricsChange({
      ...lyricsData,
      choruses: newChoruses,
      order: newOrder
    });
  };

  const addLine = (sectionType: 'verse' | 'chorus', sectionIndex: number) => {
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex] = [...newVerses[sectionIndex], { text: "", syllables: [] }];
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex] = [...newChoruses[sectionIndex], { text: "", syllables: [] }];
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const updateLine = (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number, text: string) => {
    const syllables = text.split(/[-\s]+/).filter(s => s.length > 0);
    
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex][lineIndex] = { text, syllables };
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex][lineIndex] = { text, syllables };
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const deleteLine = (sectionType: 'verse' | 'chorus', sectionIndex: number, lineIndex: number) => {
    if (sectionType === 'verse') {
      const newVerses = [...lyricsData.verses];
      newVerses[sectionIndex].splice(lineIndex, 1);
      onLyricsChange({ ...lyricsData, verses: newVerses });
    } else {
      const newChoruses = [...lyricsData.choruses];
      newChoruses[sectionIndex].splice(lineIndex, 1);
      onLyricsChange({ ...lyricsData, choruses: newChoruses });
    }
  };

  const deleteSection = (sectionId: string) => {
    const newOrder = lyricsData.order.filter(id => id !== sectionId);
    
    if (sectionId.startsWith('verse')) {
      const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
      const newVerses = lyricsData.verses.filter((_, index) => index !== verseIndex);
      onLyricsChange({ ...lyricsData, verses: newVerses, order: newOrder });
    } else if (sectionId.startsWith('chorus')) {
      const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      const newChoruses = lyricsData.choruses.filter((_, index) => index !== chorusIndex);
      onLyricsChange({ ...lyricsData, choruses: newChoruses, order: newOrder });
    }
  };

  const duplicateSection = (sectionId: string) => {
    if (sectionId.startsWith('verse')) {
      const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
      const sectionToDuplicate = lyricsData.verses[verseIndex];
      const newVerses = [...lyricsData.verses, [...sectionToDuplicate]];
      const newOrder = [...lyricsData.order, `verse${newVerses.length}`];
      onLyricsChange({ ...lyricsData, verses: newVerses, order: newOrder });
    } else if (sectionId.startsWith('chorus')) {
      const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      const sectionToDuplicate = lyricsData.choruses[chorusIndex];
      const newChoruses = [...lyricsData.choruses, [...sectionToDuplicate]];
      const newOrder = [...lyricsData.order, `chorus${newChoruses.length}`];
      onLyricsChange({ ...lyricsData, choruses: newChoruses, order: newOrder });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lyricsData.order.indexOf(active.id as string);
      const newIndex = lyricsData.order.indexOf(over.id as string);
      const newOrder = arrayMove(lyricsData.order, oldIndex, newIndex);
      onLyricsChange({ ...lyricsData, order: newOrder });
    }
  };

  const handleOrderChange = (newOrder: string[]) => {
    onLyricsChange({ ...lyricsData, order: newOrder });
  };

  const renderSection = (sectionId: string) => {
    let sectionData: LyricsLine[] = [];
    let sectionType: 'verse' | 'chorus' = 'verse';
    let sectionIndex = 0;
    let sectionTitle = '';

    if (sectionId.startsWith('verse')) {
      sectionIndex = parseInt(sectionId.replace('verse', '')) - 1;
      sectionData = lyricsData.verses[sectionIndex] || [];
      sectionType = 'verse';
      sectionTitle = `Verse ${sectionIndex + 1}`;
    } else if (sectionId.startsWith('chorus')) {
      sectionIndex = parseInt(sectionId.replace('chorus', '')) - 1;
      sectionData = lyricsData.choruses[sectionIndex] || [];
      sectionType = 'chorus';
      sectionTitle = `Chorus ${sectionIndex + 1}`;
    }

    return (
      <SortableSection
        key={sectionId}
        sectionId={sectionId}
        sectionData={sectionData}
        sectionType={sectionType}
        sectionIndex={sectionIndex}
        sectionTitle={sectionTitle}
        selectedSection={selectedSection}
        onSectionClick={setSelectedSection}
        onDeleteSection={deleteSection}
        onDuplicateSection={duplicateSection}
        onAddLine={addLine}
        onUpdateLine={updateLine}
        onDeleteLine={deleteLine}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Hymn Selection and Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hymn-selector">Select Hymn</Label>
          <Select value={selectedHymn} onValueChange={setSelectedHymn}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a hymn..." />
            </SelectTrigger>
            <SelectContent>
              {hymnOptions.map((hymn) => (
                <SelectItem key={hymn.value} value={hymn.value}>
                  {hymn.value} - {hymn.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="hymn-number">Hymn Number</Label>
          <Input
            id="hymn-number"
            value={hymnNumber}
            onChange={(e) => onHymnNumberChange(e.target.value)}
            placeholder="e.g., 001, 123"
          />
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="order" className="flex items-center gap-2">
            <List className="w-4 h-4" />
            Order
          </TabsTrigger>
          <TabsTrigger value="json" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={addVerse} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Verse
            </Button>
            <Button onClick={addChorus} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Chorus
            </Button>
          </div>

          {/* Sections */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={lyricsData.order} strategy={verticalListSortingStrategy}>
              <div>
                {lyricsData.order.map((sectionId) => renderSection(sectionId))}
              </div>
            </SortableContext>
          </DndContext>

          {lyricsData.order.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-4">No sections added yet</p>
              <div className="flex justify-center gap-2">
                <Button onClick={addVerse} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Verse
                </Button>
                <Button onClick={addChorus} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Chorus
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="order">
          <QuickOrderView lyricsData={lyricsData} onOrderChange={handleOrderChange} />
        </TabsContent>

        <TabsContent value="json">
          <JsonView lyricsData={lyricsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualEditor;
