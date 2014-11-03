gebo-pdf2htmlex
===============

A pdf2htmlEX-dependent PDF converter

# Dependencies

At the moment, installing the main `pdf2htmlEX` dependency isn't as easy as 
running `apt`. The following directions work on Ubuntu 14.04. They were adapted
from [http://blog.framebench.com/our-love-for-open-source/]
(http://blog.framebench.com/our-love-for-open-source/).

## Version control

You'll need these to obtain some of the dependencies. Chances are, some of
these are already installed:

```
sudo apt-get install git 
sudo apt-get install subversion
sudo apt-get install cvs
```

## Miscellaneous

These are all needed by one package or another:

```
sudo apt-get update
sudo apt-get install cmake
sudo apt-get install libopenjpeg-dev
sudo apt-get install libpng12-dev 
sudo apt-get install zlibc 
sudo apt-get install zlib1g-dev
sudo apt-get install libtiff-dev
sudo apt-get install libgif-dev
sudo apt-get install libjpeg-dev
sudo apt-get install libxml2-dev 
sudo apt-get install libuninameslist-dev
sudo apt-get install xorg-dev
sudo apt-get install gettext
sudo apt-get install libpango1.0-dev
sudo apt-get install libcairo2-dev
sudo apt-get install python-dev
```

## pdf2htmlEX

```
git clone --depth 1 git://github.com/coolwanglu/pdf2htmlEX.git
cd pdf2htmlEX
```

## Poppler

```
wget http://poppler.freedesktop.org/poppler-0.26.5.tar.xz
tar xvf poppler-0.26.5.tar.xz
cd poppler-0.26.5
./configure --enable-xpdf-headers
make
sudo make install
```

## Fontforge

```
cd ..
mkdir fontforge
cd fontforge
mkdir src
cd src
git clone https://github.com/coolwanglu/fontforge.git
cd fontforge
./bootstrap
./configure
make
sudo make install
sudo ldconfig
git clone git://git.sv.gnu.org/freetype/freetype2.git
svn co http://svn.code.sf.net/p/libspiro/code/
cd code
./configure
make
sudo make install
cd ..
cd ./fontforge-20120731-b/
./configure
make
sudo make install
sudo ldconfig
```

### And back to the main pdf2htmlEX directory...

```
cd ../../..
cmake . && make
sudo make install
```

# Test 

```
grunt nodeunit
```

# Enable gebo

Do this wherever you have an available `gebo` module:

```
var gebo = require('gebo-server')(testing);
gebo.enable('pdf2htmlex', require('gebo-pdf2htmlex'));
```

## License

MIT
