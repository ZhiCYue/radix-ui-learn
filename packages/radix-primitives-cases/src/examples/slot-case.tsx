import { Slot, createSlot, createSlottable } from '../slot';

// const Slot = createSlot('Slot');
const Slottable = createSlottable('TooltipContent');

function Button({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
}

const App = () => {
  return (
    <Button asChild>
      <a href="/">Click me (renders as anchor)</a>
    </Button>
  )
}

export default App;