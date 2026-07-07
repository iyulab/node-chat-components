import type { ElementSchema } from '../types/Schema.js';

const schema: ElementSchema = {
  tag: 'u-chart-block',
  description: 'Display charts using Chart.js v4 format. Use standard Chart.js configuration (type, data, options). The block accepts the exact same structure as Chart.js - no conversion needed.',
  properties: {
    type: {
      type: "string",
      enum: ["bar", "line", "pie", "doughnut", "radar", "polarArea", "bubble", "scatter"],
      description: "Chart.js chart type"
    },
    data: {
      type: "object",
      description: "Chart.js data configuration",
      additionalProperties: true
    },
    options: {
      type: "object",
      description: "Chart.js options configuration (optional)",
      additionalProperties: true
    }
  },
  required: ["type", "data"],
};

export default schema;
