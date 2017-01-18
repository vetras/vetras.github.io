# A sample Guardfile
# More info at https://github.com/guard/guard#readme

# vetras
# This is needed to have live sync on jekyll. more info here
# http://dan.doezema.com/2014/01/setting-up-livereload-with-jekyll/

require 'guard/jekyll_plus/config'

guard 'jekyll-plus', :serve => true do
  watch /.*/
  ignore /^_site/
end

guard 'livereload' do
  watch /.*/
end

