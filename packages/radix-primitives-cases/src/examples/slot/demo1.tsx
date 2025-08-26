import { useState } from 'react';
import * as Slot from '../../react/slot';

import './styles.css';

function Button({ asChild = false, ...props }) {
	const Comp = asChild ? Slot.Root : "button";
	return <Comp {...props} />;
}

export default () => {

  const [asChild, setAsChild] = useState(true);

  const handleChange = (event: any) => {
    setAsChild(event.target.checked);
  }

  return <>
    <section>
      <input type="checkbox" id="my-checkbox" checked={asChild} onChange={handleChange}/>
      <label htmlFor="my-checkbox">asChild</label>
    </section>
    <section>
      <Button asChild={asChild} className={`${asChild ? 'Button blue' : 'Button'}`}>
        <span>child</span>
      </Button>
    </section>
  </>
};