import { expect, test } from 'bun:test'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { launch, press, untilFrame } from './helpers'
import { git, initRepo } from './repo'
import { tempDir } from './temp'

test('`druk diffs` opens on the changes page with the sidebar hidden but reachable', async () => {
  const dir = tempDir('druk-diffs-')
  initRepo(dir)
  writeFileSync(join(dir, 'a.ts'), 'const a = 1\n')
  git(dir, 'add', '.')
  git(dir, 'commit', '-q', '-m', 'init')
  writeFileSync(join(dir, 'a.ts'), 'const a = CHANGED\n')

  const t = await launch(dir, {}, { height: 24, width: 100 }, { diffs: true })
  await untilFrame(t, 'CHANGED')
  expect(t.captureCharFrame()).not.toContain('EXPLORER')

  await press(t, (i) => i.pressKey('b', { ctrl: true }))
  await untilFrame(t, 'EXPLORER')
  expect(t.captureCharFrame()).toContain('CHANGED')
})
