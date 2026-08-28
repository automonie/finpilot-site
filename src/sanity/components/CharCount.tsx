import { Stack, Text } from '@sanity/ui';
import type { StringInputProps, TextInputProps } from 'sanity';

// A live character counter under a string/text field, so writers see how close
// they are to the SEO length limit (the limit itself is enforced by validation).
export function CharCount(props: StringInputProps | TextInputProps) {
  const len = (props.value || '').length;
  return (
    <Stack space={2}>
      {props.renderDefault(props)}
      <Text size={1} muted>{len} characters</Text>
    </Stack>
  );
}
