import { Link } from 'react-router-dom'

export function PublicFooter() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-dark-bg border-t border-border-subtle dark:border-dark-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-6 md:px-margin-safe py-16 md:py-section-gap max-w-container-max mx-auto">
        <div className="md:col-span-1">
          <div className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed mb-6">
            Vault
          </div>
          <p className="font-body-md text-body-md text-text-secondary mb-8">
            Preserving the weight of words in a digital world.
          </p>
        </div>

        <div className="space-y-4">
          <h6 className="font-label-sm text-label-sm text-text-primary dark:text-dark-text-primary tracking-widest mb-6">
            EXPLORE
          </h6>
          <ul className="space-y-3">
            <li>
              <Link
                to="/poems"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                Latest Poems
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h6 className="font-label-sm text-label-sm text-text-primary dark:text-dark-text-primary tracking-widest mb-6">
            VAULT
          </h6>
          <ul className="space-y-3">
            <li>
              <Link
                to="/about"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                Our Story
              </Link>
            </li>
            <li>
              <a
                href="mailto:mbithejeddie@gmail.com"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h6 className="font-label-sm text-label-sm text-text-primary dark:text-dark-text-primary tracking-widest mb-6">
            LEGAL
          </h6>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="font-body-md text-body-md text-text-secondary hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-margin-safe py-12 border-t border-border-subtle dark:border-dark-border flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <p className="font-label-sm text-label-sm text-text-secondary">
          &copy; 2024 Vault Literary Archive. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
