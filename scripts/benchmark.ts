#!/usr/bin/env tsx

/**
 * Benchmark script to measure API response times
 * Run with: npx tsx scripts/benchmark.ts
 */

const API_URL = 'http://localhost:3000/api/users';
const ITERATIONS = 100;

interface BenchmarkResult {
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
}

async function measureRequest(): Promise<number> {
  const start = performance.now();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: `user_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
      }),
    });

    await response.json();
    const end = performance.now();
    return end - start;
  } catch (error) {
    console.error('Request failed:', error);
    return -1;
  }
}

function calculateStats(timings: number[]): BenchmarkResult {
  const sorted = timings.filter(t => t > 0).sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    avg: sum / sorted.length,
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  };
}

async function runBenchmark() {
  console.log(`Running ${ITERATIONS} requests to ${API_URL}...\n`);

  // Warmup
  console.log('Warming up...');
  for (let i = 0; i < 5; i++) {
    await measureRequest();
  }

  console.log('Starting benchmark...\n');
  const timings: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const timing = await measureRequest();
    timings.push(timing);

    if ((i + 1) % 10 === 0) {
      process.stdout.write(`Progress: ${i + 1}/${ITERATIONS}\r`);
    }
  }

  console.log('\n\nResults:');
  const stats = calculateStats(timings);

  console.log(`  Min:     ${stats.min.toFixed(2)}ms`);
  console.log(`  Max:     ${stats.max.toFixed(2)}ms`);
  console.log(`  Average: ${stats.avg.toFixed(2)}ms`);
  console.log(`  Median:  ${stats.median.toFixed(2)}ms`);
  console.log(`  P95:     ${stats.p95.toFixed(2)}ms`);
  console.log(`  P99:     ${stats.p99.toFixed(2)}ms`);

  console.log('\n💡 Tips to improve performance:');
  console.log('  - Use HTTP/2 (multiplexing)');
  console.log('  - Enable keep-alive connections');
  console.log('  - Use connection pooling');
  console.log('  - Minimize JSON payload size');
  console.log('  - Deploy closer to client (CDN/edge)');
}

runBenchmark().catch(console.error);
