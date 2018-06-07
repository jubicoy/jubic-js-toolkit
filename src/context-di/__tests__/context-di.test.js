// @flow
/* eslint-env mocha */

import React, { Component } from 'react'
import type { Node } from 'react'

import { mount } from 'enzyme'
import { expect } from 'chai'

import {
  Container,
  inject
} from '../'

describe('context-di', () => {
  it('injects', () => {
    type TestProps = {
      dependency: (string) => Node,
      ownProp: string
    }

    class TestComponent extends Component<TestProps> {
      render () {
        return this.props.dependency(this.props.ownProp)
      }
    }

    const InjectedTestComponent = inject(
      (context) => ({ dependency: context.contextDependency })
    )(TestComponent)

    const wrapper = mount(
      <Container
        context={{
          contextDependency: (content) => (<h1>{content}</h1>)
        }}>
        <InjectedTestComponent ownProp='ownPropValue' />
      </Container>
    )
    expect(wrapper.find('h1').text()).to.equal('ownPropValue')
  })
})
