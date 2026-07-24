import React, { useState } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'
import { FormInput } from './FormInput'
import { Banner } from './Banner'
import { Modal } from './Modal'

/**
 * Demo component to visually verify all UI components with correct styling.
 * Use this to manually test colors, sizes, and states match the design system.
 *
 * Design system colors being verified:
 * - navy-800: #1B3A6B (primary)
 * - gold-500: #F5A623 (secondary)
 * - gray-300: #D1D5DB (borders)
 * - white: #FFFFFF (backgrounds)
 */
export const UIComponentsDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [closableBanner, setClosableBanner] = useState(true)

  return (
    <div className="p-8 bg-neutral-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Buttons Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Buttons</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="gold">Gold</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="gold" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Cards Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Cards</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 space-y-4">
            <Card>
              <Card.Body>
                <p className="text-body text-neutral-700">Basic card content</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header variant="navy">
                <h3 className="text-h3 text-white">Card Header</h3>
              </Card.Header>
              <Card.Body>
                <p className="text-body text-neutral-700">Card with navy header and body content</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <p className="text-body-sm font-semibold text-neutral-900">Default Header</p>
              </Card.Header>
              <Card.Body>
                <p className="text-body text-neutral-700">Content area</p>
              </Card.Body>
              <Card.Footer>
                <p className="text-body-sm text-neutral-500">Footer information</p>
              </Card.Footer>
            </Card>
          </div>
        </section>

        {/* Badges Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Badges</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 flex flex-wrap gap-4">
            <Badge variant="active">Active</Badge>
            <Badge variant="inactive">Inactive</Badge>
            <Badge variant="pending">Pending</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="gray">Gray</Badge>
            <Badge variant="rugby">Rugby</Badge>
            <Badge variant="hockey">Hockey</Badge>
          </div>
        </section>

        {/* Form Input Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Form Input</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 space-y-6">
            <FormInput
              label="Name"
              placeholder="Enter your name"
              hint="Enter your full name"
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="example@email.com"
            />

            <FormInput
              label="Password"
              type="password"
              error="Password must be at least 8 characters"
            />
          </div>
        </section>

        {/* Banners Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Banners</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 space-y-4">
            <Banner type="success">Success message: Operation completed successfully</Banner>
            <Banner type="danger">Danger message: An error occurred</Banner>
            <Banner type="warning">Warning message: Please review this</Banner>
            <Banner type="info">Info message: New information available</Banner>

            {closableBanner && (
              <Banner
                type="success"
                onClose={() => setClosableBanner(false)}
              >
                Closable banner: Click the X button to dismiss
              </Banner>
            )}
          </div>
        </section>

        {/* Modal Demo */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Modal</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Modal
            </Button>
          </div>
        </section>

        {/* Color Reference Grid */}
        <section>
          <h2 className="text-h2 mb-6 text-neutral-900">Design System Colors</h2>

          <div className="bg-white p-6 rounded-card border-[0.5px] border-neutral-300 space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-navy-800 rounded-btn border-[0.5px] border-neutral-300" />
              <div>
                <p className="font-semibold text-neutral-900">navy-800</p>
                <p className="text-body-sm text-neutral-500">#1B3A6B - Primary institutional</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-gold-500 rounded-btn border-[0.5px] border-neutral-300" />
              <div>
                <p className="font-semibold text-neutral-900">gold-500</p>
                <p className="text-body-sm text-neutral-500">#F5A623 - Institutional gold</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-neutral-300 rounded-btn border-[0.5px] border-neutral-300" />
              <div>
                <p className="font-semibold text-neutral-900">gray-300</p>
                <p className="text-body-sm text-neutral-500">#D1D5DB - Borders and separators</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal Example"
        actions={[
          { label: 'Cancel', onClick: () => setModalOpen(false), variant: 'ghost' },
          { label: 'Confirm', onClick: () => setModalOpen(false), variant: 'primary' },
        ]}
      >
        <p className="text-body text-neutral-700 mb-4">
          This is a modal dialog demonstrating the correct styling and behavior according to the design system.
        </p>
        <p className="text-body text-neutral-700">
          The modal has a backdrop that can be clicked to close, an X button in the header, and optional action buttons in the footer.
        </p>
      </Modal>
    </div>
  )
}
