# Getting Ruby

Install the ruby version manager:
* `chruby` -- manages installed ruby versions
* `ruby-install` -- install a version

With:

     $ brew install chruby ruby-install

Then, install the latest ruby version:

    $ ruby-install ruby

Change to a given version:

    $ chruby ruby-3
    $ ruby -v

    # Note: 'chruby' was only found on my system after adding it to the zsh profile:
    
    # add chruby to shell with ruby v3 as default version
    source /usr/local/opt/chruby/share/chruby/chruby.sh
    chruby ruby-3

# Getting Jekyll

Install the gems:

    $ cd <project-root>
    gem install bundler
    bundler install

Run the project using `bundler`, because it avoids gem conflicts:

    bundle exec jekyll build
    bundle exec jekyll serve


