import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useBlockchain } from './BlockchainContext';
import { Block, CurrentChainResponse } from './types';
import { getCurrentChain } from './utils';

export default function BlockchainOverview() {
  const { blocks } = useBlockchain();
  console.log('Current state of the blocks');
  console.log(blocks);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #fff',
        borderRadius: 2,
        p: 2,
        mb: 5,
        bgcolor: '#333',
      }}
    >
      <Typography variant="h6">Blockchain</Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '0px',
          width: '100%',
          mt: '20px',
          alignItems: 'flex-start',
          overflowX: 'scroll',
          pb: '20px',
        }}
      >
        {blocks.map((block, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Block block={block} />
            {index < blocks.length - 1 && <Connector />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Block({ block }: { block: Block }) {
  return (
    <Box
      sx={{
        border: '1px solid #fff',
        borderRadius: 2,
        height: '150px',
        width: '200px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        bgcolor: '#242424',
      }}
    >
      <Typography>Block #{block.index}</Typography>
    </Box>
  );
}

function Connector() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* Horizontal line starting near bottom */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100% - 30px)',
          left: 0,
          width: '50px',
          height: '2px',
          bgcolor: '#fff',
        }}
      />
      {/* Vertical line going up */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100% - 108px)',
          left: '50px',
          width: '2px',
          height: '80px',
          bgcolor: '#fff',
        }}
      />
      {/* Horizontal line to next block */}
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(100% - 110px)',
          left: '50px',
          width: '50px',
          height: '2px',
          bgcolor: '#fff',
        }}
      />
    </Box>
  );
}
