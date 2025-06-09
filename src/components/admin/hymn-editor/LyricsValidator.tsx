
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface LyricsLine {
  text: string;
  syllables: string[];
}

interface LyricsData {
  order: string[];
  verses: LyricsLine[][];
  choruses: LyricsLine[][];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class LyricsValidator {
  validate(lyricsData: LyricsData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if there's at least one section
    if (lyricsData.order.length === 0) {
      errors.push("At least one verse or chorus is required");
    }

    // Check for empty sections
    lyricsData.order.forEach((sectionId) => {
      if (sectionId.startsWith('verse')) {
        const verseIndex = parseInt(sectionId.replace('verse', '')) - 1;
        const verse = lyricsData.verses[verseIndex];
        if (!verse || verse.length === 0) {
          errors.push(`Verse ${verseIndex + 1} is empty`);
        } else {
          // Check for empty lines
          verse.forEach((line, lineIndex) => {
            if (!line.text.trim()) {
              warnings.push(`Verse ${verseIndex + 1}, line ${lineIndex + 1} is empty`);
            }
          });
        }
      } else if (sectionId.startsWith('chorus')) {
        const chorusIndex = parseInt(sectionId.replace('chorus', '')) - 1;
        const chorus = lyricsData.choruses[chorusIndex];
        if (!chorus || chorus.length === 0) {
          errors.push(`Chorus ${chorusIndex + 1} is empty`);
        } else {
          // Check for empty lines
          chorus.forEach((line, lineIndex) => {
            if (!line.text.trim()) {
              warnings.push(`Chorus ${chorusIndex + 1}, line ${lineIndex + 1} is empty`);
            }
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

interface LyricsValidatorProps {
  lyricsData: LyricsData;
  onValidationChange: (isValid: boolean) => void;
}

const LyricsValidatorComponent = ({ lyricsData, onValidationChange }: LyricsValidatorProps) => {
  const validator = new LyricsValidator();
  const validation = validator.validate(lyricsData);

  // Notify parent component of validation status
  React.useEffect(() => {
    onValidationChange(validation.isValid);
  }, [validation.isValid, onValidationChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {validation.isValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={validation.isValid ? "default" : "destructive"}>
              {validation.isValid ? "Valid" : "Invalid"}
            </Badge>
          </div>

          {validation.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-600 mb-2">Errors:</h4>
              <ul className="space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="w-3 h-3" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-600 mb-2">Warnings:</h4>
              <ul className="space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {validation.isValid && validation.warnings.length === 0 && (
            <p className="text-sm text-green-600">All validations passed!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LyricsValidatorComponent;
