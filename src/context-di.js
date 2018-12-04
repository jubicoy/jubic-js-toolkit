// @flow
/* global $Diff */

import React from 'react'
import type {
  ChildrenArray,
  ComponentType,
  Element
} from 'react'

let SINGLETON_NOTICE = false

const ContainerContext = React.createContext()

type ContainerProps<Context>
  = {
    children: ChildrenArray<Element<any>>,
    context: Context
  }

export class Container<Context> extends React.Component<ContainerProps<Context>> {
  constructor (props: ContainerProps<Context>) {
    super(props)
    if (SINGLETON_NOTICE) {
      console.error('Looks like multiple containers have been initialized')
    }
    SINGLETON_NOTICE = true
  }

  render () {
    if (this.props.children === undefined) return null

    return (
      <ContainerContext.Provider value={this.props.context}>
        {this.props.children}
      </ContainerContext.Provider>
    )
  }
}

type InjectProps<Context, ChildProps, Injected>
  = {
    mapContextToProps: (Context) => Injected,
    component: ComponentType<ChildProps>
  }
  & ChildProps

class Inject<Context, ChildProps, Injected> extends React.PureComponent<InjectProps<Context, ChildProps, Injected>> {
  render () {
    const ChildComponent = this.props.component
    const forwardedProps = {
      ...this.props
    }
    delete forwardedProps.component

    return (
      <ContainerContext.Consumer>
        {
          (context) => {
            if (!context) return null

            return (
              <ChildComponent
                {...{
                  ...forwardedProps,
                  ...this.props.mapContextToProps(((context: any): Context))
                }} />
            )
          }
        }
      </ContainerContext.Consumer>
    )
  }
}

type PartiallyAppliedInject<
  ChildProps,
  Injected,
  ResultProps: $Diff<ChildProps, Injected>
> = (component: ComponentType<ChildProps>) => ComponentType<ResultProps>

export function inject<
  ChildProps,
  Context,
  Injected,
  ResultProps: $Diff<ChildProps, Injected>
> (
  mapContextToProps: (Context) => Injected
): PartiallyAppliedInject<ChildProps, Injected, ResultProps> {
  return function (component: ComponentType<ChildProps>) {
    return (props: ChildProps) => (
      <Inject
        mapContextToProps={mapContextToProps}
        component={component}
        {...props} />
    )
  }
}
