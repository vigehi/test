import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
/* eslint-disable react-hooks/rules-of-hooks */
const customMenu = ({
  children, style, className, 'aria-labelledby': labeledBy,
}, ref) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState('');

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      aria-labelledby={labeledBy}
    >
      <Form.Control
        autoFocus
        className="mx-3 my-2 w-auto"
        placeholder="Type to filter..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <ul className="list-unstyled m-0">
        {React.Children.toArray(children).filter(
          (child) => !value || child.props.id?.toLowerCase().startsWith(value.toLowerCase()),
        )}
      </ul>
    </div>
  );
};

export default React.forwardRef(customMenu);
