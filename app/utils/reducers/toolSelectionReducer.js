export const defaultToolOptions = {
  select: {
    active: true,
    subOptions: {
      pixelSelect: true,
      colorSelect: false,
    },
  },
  highlight: {
    active: false,
    subOptions: {
      highlightRow: true,
    },
  },
  deselect: {
    active: false,
    subOptions: {
      pixelDeselect: true,
      colorDeselect: false,
    },
  },
};

export function toolOptionsReducer(toolOptionsDraft, action) {
  console.log(action);
  for (const [toolOption, toolOptionData] of Object.entries(toolOptionsDraft)) {
    if (toolOption === action.type) {
      toolOptionData.active = true;
      for (const subOption of Object.keys(toolOptionData.subOptions)) {
        console.log(subOption);
        if (subOption === action.subType) {
          console.log(`turn on ${subOption}`)
          toolOptionData.subOptions[subOption] = true;
        } else {
          toolOptionData.subOptions[subOption] = false;
        }
      }
    } else {
      toolOptionData.active = false;
    }
  }
  console.log(`now ${JSON.stringify(toolOptionsDraft)}`)
}
