import { useState } from 'react';
import { Slot, createSlot, createSlottable } from '../slot';

// const Slot = createSlot('Slot');
const Slottable = createSlottable('TooltipContent');

function Button({ asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp {...props} />;
}

const App = () => {
  const [asChild, setAsChild] = useState(true);
  const handleClick = () => {
    console.log('Button clicked');
  }

  const handleChange = (event: any) => {
    setAsChild(event.target.checked);
  }

  return (
    <div>
      <div>
        <input type="checkbox" id="my-checkbox" checked={asChild} onChange={handleChange}/>
        <label htmlFor="my-checkbox">asChild</label>
      </div>
      <Button asChild={asChild} name={'btn'}>
        <span onClick={handleClick}>Click me (print log)</span>
      </Button>
    </div>
  )
}

export default App;