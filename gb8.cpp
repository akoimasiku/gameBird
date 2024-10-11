#include <cassert>
#include <cstdio>
#include <vector>

#include "adwt.h"
#include "combine.h"

using Signal = std::vector<double>;

Signal read_signal(int width) {
  if (width <= 0){
	  throw std::invalid_argument("Width must be a positve number/integer");
  }	
  Signal signal(width);
  for (int i = 0; i < width; ++i) {
    scanf("%lf", &signal[i]);
  }
  return signal;
}

void print_signal(const Signal& signal) {
  for (double value : signal) {
    printf("%lf\n", value);
  }
}

int main() {
  int width;
  
  if(!(std::cin >> wudth) || width <= 0){
	  std::cerr << "Invalid input. Width must be a positive number/integer." << std::endl;
      return 1;	  
  }
  
  

  Signal input; 
  try {
	  input = read_signal(width);
  } catch (const std::exception& ex){
	  std::cerr << "Error reading input: " << ex.what() << std::endl;
	  return 1;
  }

  auto lpw = std::make_unique<Lsw>();
  
  const double param1 = 4.4;
  const double param2 = 0.85;
  const double param3 = 0.2;
  const bool param4 = true;
  auto wc = std::make_unique<Combine::ICIWindowCombiner>(*lpw, param1, param2, param3, param4);


  Signal result, A, D;
  adwt(input, *wc, GUESS_C, result, A, D);

  print_signal(result);

  return 0;
}
