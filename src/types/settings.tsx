import React from 'react';

export type StateMap = {
  [key: string]: React.Dispatch<React.SetStateAction<any>>,
};
