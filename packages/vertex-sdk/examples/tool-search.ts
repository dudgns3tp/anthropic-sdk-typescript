#!/usr/bin/env -S npm run tsn -T

import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const client = new AnthropicVertex();

async function main() {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    messages: [{ role: 'user', content: 'What is the weather?' }],
    tools: [
      {
        type: 'tool_search_tool_regex_20251119',
        name: 'tool_search_tool_regex',
      },
      {
        type: 'tool_search_tool_bm25_20251119',
        name: 'tool_search_tool_bm25',
      },
      {
        name: 'get_weather',
        description: 'Get the weather',
        input_schema: {
          type: 'object' as const,
          properties: { location: { type: 'string' } },
          required: ['location'],
        },
        defer_loading: true,
      },
    ],
  });

  for (const block of msg.content) {
    if (block.type === 'server_tool_use') {
      console.log('Server tool use:', block.name);
    } else if (block.type === 'tool_search_tool_result') {
      console.log('Tool search result:', block.tool_use_id);
    } else if (block.type === 'tool_use') {
      console.log('Tool use:', block.name);
    }
  }
}

main().catch(console.error);
