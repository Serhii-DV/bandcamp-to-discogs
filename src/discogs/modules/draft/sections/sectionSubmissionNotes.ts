import {
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getSubmissionNotesTextarea } from '../html';
import {
  setSection,
  setupSectionGroupHints,
  setSubmissionNotes
} from '../utils';

export function setupSectionSubmissionNotes(
  submissionNotes: MetadataValue
): void {
  const submissionNotesGroup = new VariationsGroup(
    'Submission notes',
    [getSubmissionNotesTextarea()],
    metadataValueAsArray(submissionNotes)
  );

  setSection(
    new Section('submission_notes', 'Auto-generated submission notes', '')
  );

  setSubmissionNotes(metadataValueAsString(submissionNotes));
  setupSectionGroupHints(submissionNotesGroup);
}
