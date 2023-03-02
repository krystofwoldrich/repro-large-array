#import "RCTTestModule.h"

@implementation RCTTestModule

RCT_EXPORT_METHOD(test: (NSArray*)array
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(nil);
}

RCT_EXPORT_MODULE(TestModule);

@end

