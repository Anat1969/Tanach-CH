import Spiral from './Spiral';

// The same spiral, not interactive, shown in the story header.
export default function Motif({ size = 120 }: { size?: number }) {
  return <Spiral size={size} />;
}
