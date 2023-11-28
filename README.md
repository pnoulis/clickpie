## About

**clickpie** (clickup + ie) contains all information related to [intelligent

entertainment]'s customizations and integrations for the [clickup] project

management application.

## Getting started

### Prerequisites

- git

  version: >=2.34.1

- make
  
  version: >=4.3

### Installation

```sh
git clone git@github.com:pnoulis/clickpie.git
./configure
make
make install
```

## Developing

### Prerequisites

### Configure

#### Overview

The configuration stage is a prerequisite for building the project. Its primary

function is to produce the Makefile that will be used to actually build the

project but it also fulfills other roles such as:

1. Analyze the host system.

2. Setup up a development environment.

3. Gather ARGUMENTS and OPTIONS for the various modules.

4. Produce a Makefile, dynamically shaping targets.

5. Enable/Disable features.

6. Swap modules.


To find out the ARGUMENTS and OPTIONS the configuration stage expects, one can

either read or execute the script. Running the script will result in failure but

I have designed the output to be instructive. In this sense, the ./configure

script is self-documenting.

#### Usage

```sh
./configure
```

### Build

```sh
# By default make will run the build target.
# So that `make` or `make build` are equivalent.
make
# or
make build
```

### Develop
### Test
### Deploy

## Contact

Pavlos noulis - pavlos.noulis@gmail.com

project link - [clickpie](https://github.com/pnoulis/clickpie)


[clickup]: https://clickup.com/
[intelligent entertainment]: https://iegroup.gr/
