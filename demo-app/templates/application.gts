import { pageTitle } from 'ember-page-title';
import Portal from '#src/components/portal.gts';
import PortalTarget from '#src/components/portal-target.gts';

<template>
  {{pageTitle "ember-stargate"}}

  <Portal @target="target">
    <p>This content used a Portal!</p>
  </Portal>

  <h2 id="title">Welcome to ember-stargate</h2>

  <PortalTarget @name="target" />
</template>
